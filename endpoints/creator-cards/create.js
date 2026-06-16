/* eslint-disable prettier/prettier */
const { createHandler } = require('@app-core/server');
const { appLogger } = require('@app-core/logger');
const creatorCardService = require('@app/services/creator-cards/create');

module.exports = createHandler({
  path: '/creator-cards',
  method: 'post',
  middlewares: [],
  async onResponseEnd(rc, rs) {
    appLogger.info({ requestContext: rc, response: rs }, 'create-creator-card-completed');
  },
  async handler(rc, helpers) {
    const payload = rc.body;

    const result = await creatorCardService(payload);

    return {
      status: helpers.http_statuses.HTTP_200_OK || 200,
      message: 'Creator Card Created Successfully.',
      data: result,
    };
  },
});
