const { pool } = require('../connectors/db');
const unbilledActiveLicences = require('../queries/unbilledActiveLicences');
const { logger } = require('../../logger');
const csvWritingHelper = require('../helpers/write-csv-to-s3');
const { getFinancialYear } = require('../helpers/financial-year');
const handler = async () => {
  try {
    const financialYear = getFinancialYear(new Date());

    // Run query
    const res = await pool.query(unbilledActiveLicences, [financialYear]);

    // Write results to S3
    const filename = 'unbilledActiveLicences.csv';
    await csvWritingHelper.generateCsv(filename, res.rows, res.fields);
  } catch (e) {
    logger.error(e);
  }
};

exports.handler = handler;
