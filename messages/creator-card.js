/* eslint-disable prettier/prettier */
module.exports = {
  // Field-level Validation Messages
  TITLE_LENGTH_ERROR: 'Title must be between 3 and 100 characters',
  DESCRIPTION_LENGTH_ERROR: 'Description maximum length is 500 characters',
  CREATOR_REF_LENGTH_ERROR: 'creator_reference must be exactly 20 characters',
  INVALID_STATUS_ERROR: 'Status must be either draft or published',

  // Conditional Access Rule Messages
  ACCESS_CODE_REQUIRED: 'access_code is required when access_type is private',
  INVALID_ACCESS_CODE_FORMAT: 'Invalid access code',
  ACCESS_CODE_RESTRICTION: 'This card is private. An access code is required',
  INVALID_ACCESS_TYPE: 'access_type must be public or private',

  // Structural Array/Object Messages
  LINK_TITLE_ERROR: 'Link title must be between 1 and 100 characters',
  LINK_URL_ERROR: 'Link URL must be under 200 characters and start with http:// or https://',
  INVALID_CURRENCY: 'Invalid currency code specified',
  RATES_ARRAY_EMPTY: 'rates must be a non-empty array if service_rates is present',
  RATE_NAME_ERROR: 'Rate name must be between 3 and 100 characters',
  RATE_DESCRIPTION_ERROR: 'Rate description maximum length is 250 characters',
  RATE_AMOUNT_ERROR: 'Rate amount must be a positive integer in minor units',

  // Custom Business Rule Messages
  SLUG_FORMAT_ERROR:
    'Slug must be 5-50 characters containing alphanumeric characters, hyphens, or underscores only',
  SLUG_TAKEN: 'Slug is already taken',
  CARD_NOT_FOUND: 'Creator card not found',
  DELETION_DENIED: 'You do not have permission to delete this card',
};
