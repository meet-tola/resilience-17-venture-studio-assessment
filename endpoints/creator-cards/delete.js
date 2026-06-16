/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
const { createHandler } = require('@app-core/server');
const { appLogger } = require('@app-core/logger');
const deleteCardService = require('@app/services/creator-cards/delete');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'delete',
  middlewares: [],
  async onResponseEnd(rc, rs) {
    appLogger.info({ requestContext: rc, response: rs }, 'delete-creator-card-completed');
  },
  async handler(rc, helpers) {
    const { slug } = rc.params;
    const { creator_reference } = rc.body;

    const result = await deleteCardService({ slug, creator_reference });

    return {
      status: helpers.http_statuses.HTTP_200_OK || 200,
      message: 'Creator Card Deleted Successfully.',
      data: result,
    };
  },
});
