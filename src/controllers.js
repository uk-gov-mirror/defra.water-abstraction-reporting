const pkg = require('../package.json');
const reportFetcher = require('./lib/helpers/report-fetcher');
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

  return reportFetcher.getObject(reportKey)
    .then(response => response.readStream)
    .catch(err => {
      logger.error(err);
      return h.response({ data: null, err }).code(500);
    });
};

exports.getStatus = getStatus;
exports.getReport = getReport;
