/* eslint-disable camelcase */
const validator = require('@app-core/validator');
const { throwAppError } = require('@app-core/errors');
const { CreatorCard } = require('@app/models');
const { CreatorCardMessages } = require('@app/messages');
const { ulid } = require('ulid');

// VSL Spec for primary field level structure validation
const creatorCardSpec = `root {
  title string
  description any?
  slug any?
  creator_reference string
  links any?
  service_rates any?
  status "draft" | "published"
  access_type any?
  access_code any?
}`;

const parsedCreatorCardSpec = validator.parse(creatorCardSpec);

/**
 * Helper to auto-generate unique slugs based on R17 constraints
 */
async function generateUniqueSlug(title) {
  const baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');

  const addSuffix = (s) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let suffix = '';
    for (let i = 0; i < 6; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${s.substring(0, 43)}-${suffix}`;
  };

  const resolveUniqueSlug = async (slugCandidate) => {
    const exists = await CreatorCard.findOne({ slug: slugCandidate, deleted: null });
    if (exists) {
      return resolveUniqueSlug(addSuffix(baseSlug));
    }
    return slugCandidate;
  };

  let finalSlug = baseSlug;
  if (finalSlug.length < 5) {
    finalSlug = addSuffix(finalSlug);
  }

  return resolveUniqueSlug(finalSlug);
}

async function create(serviceData) {
  try {
    validator.validate(serviceData, parsedCreatorCardSpec);
  } catch (err) {
    throwAppError(err.message || 'Validation failed.', 'VALIDATION_ERROR');
  }

  const {
    title,
    description,
    slug,
    creator_reference,
    links = [],
    service_rates,
    status,
    access_type = 'public',
    access_code,
  } = serviceData;

  // Strict Custom Field Validation using clean dictionary lookups
  if (!title || title.length < 3 || title.length > 100) {
    throwAppError(CreatorCardMessages.TITLE_LENGTH_ERROR, 'VALIDATION_ERROR');
  }
  if (description && description.length > 500) {
    throwAppError(CreatorCardMessages.DESCRIPTION_LENGTH_ERROR, 'VALIDATION_ERROR');
  }
  if (!creator_reference || creator_reference.length !== 20) {
    throwAppError(CreatorCardMessages.CREATOR_REF_LENGTH_ERROR, 'VALIDATION_ERROR');
  }
  if (status !== 'draft' && status !== 'published') {
    throwAppError(CreatorCardMessages.INVALID_STATUS_ERROR, 'VALIDATION_ERROR');
  }

  // Conditional Access Control Evaluations
  const normalizedAccessType = access_type || 'public';

  if (normalizedAccessType === 'private') {
    if (!access_code) {
      throwAppError(CreatorCardMessages.ACCESS_CODE_REQUIRED, 'AC01');
    }
    if (!/^[a-zA-Z0-9]{6}$/.test(access_code)) {
      throwAppError(CreatorCardMessages.INVALID_ACCESS_CODE_FORMAT, 'VALIDATION_ERROR');
    }
  } else if (normalizedAccessType === 'public') {
    if (access_code !== undefined && access_code !== null && access_code !== '') {
      throwAppError(CreatorCardMessages.ACCESS_CODE_RESTRICTION, 'AC05');
    }
  } else {
    throwAppError(CreatorCardMessages.INVALID_ACCESS_TYPE, 'VALIDATION_ERROR');
  }

  // Validate Links Array
  if (links && Array.isArray(links)) {
    links.forEach((link) => {
      if (!link.title || link.title.length < 1 || link.title.length > 100) {
        throwAppError(CreatorCardMessages.LINK_TITLE_ERROR, 'VALIDATION_ERROR');
      }
      if (!link.url || link.url.length > 200 || !/^https?:\/\//.test(link.url)) {
        throwAppError(CreatorCardMessages.LINK_URL_ERROR, 'VALIDATION_ERROR');
      }
    });
  }

  // Validate Service Rates Object
  if (service_rates) {
    const { currency, rates } = service_rates;
    if (!['NGN', 'USD', 'GBP', 'GHS'].includes(currency)) {
      throwAppError(CreatorCardMessages.INVALID_CURRENCY, 'VALIDATION_ERROR');
    }
    if (!rates || !Array.isArray(rates) || rates.length === 0) {
      throwAppError(CreatorCardMessages.RATES_ARRAY_EMPTY, 'VALIDATION_ERROR');
    }
    rates.forEach((rate) => {
      if (!rate.name || rate.name.length < 3 || rate.name.length > 100) {
        throwAppError(CreatorCardMessages.RATE_NAME_ERROR, 'VALIDATION_ERROR');
      }
      if (rate.description && rate.description.length > 250) {
        throwAppError(CreatorCardMessages.RATE_DESCRIPTION_ERROR, 'VALIDATION_ERROR');
      }
      if (!Number.isInteger(rate.amount) || rate.amount < 1) {
        throwAppError(CreatorCardMessages.RATE_AMOUNT_ERROR, 'VALIDATION_ERROR');
      }
    });
  }

  // Handle Slug Evaluation
  let finalSlug;
  if (slug) {
    if (slug.length < 5 || slug.length > 50 || !/^[a-z0-9-_]+$/i.test(slug)) {
      throwAppError(CreatorCardMessages.SLUG_FORMAT_ERROR, 'VALIDATION_ERROR');
    }
    const existingCard = await CreatorCard.findOne({ slug, deleted: null });
    if (existingCard) {
      throwAppError(CreatorCardMessages.SLUG_TAKEN, 'SL02');
    }
    finalSlug = slug;
  } else {
    finalSlug = await generateUniqueSlug(title);
  }

  const now = Date.now();

  const newCard = new CreatorCard({
    _id: ulid(),
    title,
    description,
    slug: finalSlug,
    creator_reference,
    links,
    service_rates,
    status,
    access_type: normalizedAccessType,
    access_code: access_code || null,
    created: now,
    updated: now,
    deleted: null,
  });

  await newCard.save();

  return newCard.toJSON();
}

module.exports = create;
