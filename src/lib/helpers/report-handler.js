const db = require('../connectors/db');
const billedActiveLicences = require('../queries/billedActiveLicences');
const unbilledActiveLicences = require('../queries/unbilledActiveLicences');
const uncreditedInactiveLicences = require('../queries/uncreditedInactiveLicences');
const { logger } = require('../../logger');
const csvWritingHelper = require('../helpers/write-csv-to-s3');
const { getFinancialYear } = require('@envage/water-abstraction-helpers').charging;

const reportQueryMapper = {
  billedActiveLicencesReport: billedActiveLicences,
  unbilledActiveLicencesReport: unbilledActiveLicences,
  uncreditedInactiveLicencesReport: uncreditedInactiveLicences
};

const handler = async reportName => {
  try {
    const financialYear = getFinancialYear(new Date());
    // Run query
    const res = await db.pool.query(reportQueryMapper[reportName], [financialYear]);
    // Write results to S3
    const filename = `${reportName}.csv`;
    return csvWritingHelper.generateCsv(filename, res.rows, res.fields);
  } catch (e) {
    logger.error(e);
    throw (e);
  }
};

exports.handler = handler;
