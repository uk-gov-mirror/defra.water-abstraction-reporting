const handler = require('../../../src/lib/reports-handlers/revokedUncreditedLicencesReportHandler').handler;
const { pool } = require('../../../src/lib/connectors/db');
const csvWritingHelper = require('../../../src/lib/helpers/write-csv-to-s3');
const financialYearHelper = require('../../../src/lib/helpers/financial-year');
const Lab = require('@hapi/lab');
const { experiment, test, beforeEach, afterEach } = exports.lab = Lab.script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

experiment('lib/reports-handlers/revokedUncreditedLicencesReportHandler', () => {
  beforeEach(async () => {
    await sandbox.stub(pool, 'query').resolves({ rows: [], fields: [] });

    await sandbox.stub(csvWritingHelper, 'generateCsv');
    await sandbox.stub(financialYearHelper, 'getFinancialYear');
  });

  afterEach(() => {
    sandbox.restore();
  });

  experiment('when handler is called', () => {
    beforeEach(async () => {
      await csvWritingHelper.generateCsv.resolves({});
      await financialYearHelper.getFinancialYear.returns(2020);
      await handler();
    });
    test('calls the database with a query', () => {
      expect(pool.query.called).to.be.true();
    });
    test('calls the csv generator', () => {
      expect(csvWritingHelper.generateCsv.called).to.be.true();
    });
  });
});
