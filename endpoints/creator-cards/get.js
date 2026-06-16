/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
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
    const { access_code } = rc.query;

    const result = await getCardService({ slug, access_code });

    return {
      status: helpers.http_statuses.HTTP_200_OK || 200,
      message: 'Creator Card Retrieved Successfully.',
      data: result,
    };
  },
});
