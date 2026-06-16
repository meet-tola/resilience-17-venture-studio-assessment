/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
const { throwAppError } = require('@app-core/errors');
const { CreatorCard } = require('@app/models');
const { CreatorCardMessages } = require('@app/messages');

async function get(serviceData) {
  const { slug, access_code } = serviceData;

  // Check Existence (Must match slug and not be soft-deleted)
  const card = await CreatorCard.findOne({ slug, deleted: null });
  if (!card) {
    throwAppError(CreatorCardMessages.CARD_NOT_FOUND, 'NF01');
  }

  // Check Status (Drafts are invisible to the public endpoint)
  if (card.status === 'draft') {
    throwAppError(CreatorCardMessages.CARD_NOT_FOUND, 'NF02');
  }

  // Evaluate Private Access Rules
  if (card.access_type === 'private') {
    // Access code missing entirely
    if (!access_code) {
      throwAppError(CreatorCardMessages.ACCESS_CODE_REQUIRED, 'AC03');
    }
    // Access code mismatch
    if (access_code !== card.access_code) {
      throwAppError(CreatorCardMessages.INVALID_ACCESS_CODE_FORMAT, 'AC04');
    }
  }

  const serializedCard = card.toJSON();

  // Cleanse response payload entirely
  delete serializedCard.access_code;

  return serializedCard;
}

module.exports = get;
