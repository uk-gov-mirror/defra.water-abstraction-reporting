const csvWritingHelper = require('../../../src/lib/helpers/write-csv-to-s3');
const Lab = require('@hapi/lab');
const { experiment, test, beforeEach, afterEach } = exports.lab = Lab.script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();
const csvObjectWriter = require('csv-writer');

experiment('lib/helpers/write-csv-to-s3', () => {
  beforeEach(async () => {
    sandbox.spy(csvObjectWriter, 'createObjectCsvWriter');

    await csvWritingHelper.generateCsv(
      'somefile.csv',
      [{ somefield: 'somevalue' }],
      [{ name: 'somefield' }
      ]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  test('calls csvObjectWriter', () => {
    expect(csvObjectWriter.createObjectCsvWriter.called).to.be.true();
  });
});
