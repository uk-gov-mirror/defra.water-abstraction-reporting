const { pool } = require('../connectors/db');
const uncreditedInactiveLicences = require('../queries/uncreditedInactiveLicences');
const { logger } = require('../../logger');
const csvWritingHelper = require('../helpers/write-csv-to-s3');
const { getFinancialYear } = require('../helpers/financial-year');
const handler = async () => {
  try {
    const financialYear = getFinancialYear(new Date());
    // Run query
    const res = await pool.query(uncreditedInactiveLicences, [financialYear]);
    // Write results to S3
    const filename = 'uncreditedInactiveLicencesReport.csv';
    await csvWritingHelper.generateCsv(filename, res.rows, res.fields);
  } catch (e) {
    logger.error(e);
  }
};

exports.handler = handler;
