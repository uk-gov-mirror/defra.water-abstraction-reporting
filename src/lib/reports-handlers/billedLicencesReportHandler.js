const db = require('../connectors/db');
const billedLicences = require('../queries/billedLicences');
const { logger } = require('../../logger');
const csvWritingHelper = require('../helpers/write-csv-to-s3');
const { getFinancialYear } = require('../helpers/financial-year');
const handler = async () => {
  try {
    const financialYear = getFinancialYear(new Date());
    // Run query
    const res = await db.pool.query(billedLicences, [financialYear]);
    // Write results to S3
    const filename = 'billedLicencesReport.csv';
    await csvWritingHelper.generateCsv(filename, res.rows, res.fields);
    return 'ok';
  } catch (e) {
    logger.error(e);
  }
};

exports.handler = handler;
