const pkg = require('../package.json');
const { getObject } = require('./lib/helpers/report-fetcher');
const { pool } = require('./lib/connectors/db');
const { logger } = require('./logger');

const getStatus = async () => {
  try {
    const { rows: data } = await pool.query('select \'WORLD\' as HELLO FROM water.application_state;');
    return {
      data,
      error: null,
      version: pkg.version
    };
  } catch (error) {
    return { error };
  }
};

const getReport = async (request, h) => {
  const { reportKey } = request.params;
  return getObject(reportKey)
    .then((response) => {
      const outputResponse = h.response(response.readStream).code(response.statusCode);

      Object.fromEntries(Object.entries(response.headers).map(([k, v]) => outputResponse.header(k, v)));

      return outputResponse;
    })
    .catch((err) => {
      logger.error(err);
      h.status(500);
      return h('error');
    });
};

exports.getStatus = getStatus;
exports.getReport = getReport;
