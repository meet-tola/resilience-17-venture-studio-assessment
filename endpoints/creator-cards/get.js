/* eslint-disable prettier/prettier */
const { createHandler } = require('@app-core/server');
const { appLogger } = require('@app-core/logger');
const getCardService = require('@app/services/creator-cards/get');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'get',
  middlewares: [],
  async onResponseEnd(rc, rs) {
    appLogger.info({ requestContext: rc, response: rs }, 'get-creator-card-completed');
  },
  async handler(rc, helpers) {
    const { slug } = rc.params;
    const { access_code: accessCode } = rc.query;

    const result = await getCardService({ slug, accessCode });

    return {
      status: helpers.http_statuses.HTTP_200_OK || 200,
      message: 'Creator Card Retrieved Successfully.',
      data: result,
    };
  },
});
