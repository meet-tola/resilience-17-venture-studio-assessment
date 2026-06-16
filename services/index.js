/* eslint-disable prettier/prettier */
const create = require('./creator-cards/create');
const get = require('./creator-cards/get');
const remove = require('./creator-cards/delete');

module.exports = {
  'creator-cards/create': create,
  'creator-cards/get': get,
  'creator-cards/delete': remove,
};
