/* eslint-disable prettier/prettier */
const { createHandler } = require('@app-core/server');

module.exports = createHandler({
  path: '*',
  method: 'all', // Intercepts all verbs (GET, POST, DELETE, etc.)
  // eslint-disable-next-line no-unused-vars
  async handler(rc) {
    // Capture the exact high-resolution entry time
    const requestStartTime = process.hrtime();

    // Pass data forward into the endpoint's execution chain
    return {
      augments: {
        meta: {
          metrics: {
            startTime: requestStartTime,
          },
        },
      },
    };
  },
});
