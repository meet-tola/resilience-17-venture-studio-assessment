/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
const { throwAppError } = require('@app-core/errors');
const { CreatorCard } = require('@app/models');
const { CreatorCardMessages } = require('@app/messages');

async function remove(serviceData) {
  const { slug, creator_reference } = serviceData;

  if (!creator_reference || creator_reference.length !== 20) {
    throwAppError(CreatorCardMessages.CREATOR_REF_LENGTH_ERROR, 'VALIDATION_ERROR');
  }

  // Locate Target Card
  const card = await CreatorCard.findOne({ slug, deleted: null });
  if (!card) {
    throwAppError(CreatorCardMessages.CARD_NOT_FOUND, 'NF01');
  }

  // Verify Client Identity Ownership
  if (card.creator_reference !== creator_reference) {
    throwAppError(CreatorCardMessages.DELETION_DENIED, 'VALIDATION_ERROR');
  }

  // Execute Soft-Delete timestamp persistence
  card.deleted = Date.now();
  card.updated = Date.now();
  await card.save();

  return card.toJSON();
}

module.exports = remove;
