'use strict';

const Lab = require('@hapi/lab');
const { experiment, test, beforeEach, afterEach, before } = exports.lab = Lab.script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const { generateCsv, s3 } = require('../../../src/lib/helpers/write-csv-to-s3');

experiment('lib/helpers/write-csv-to-s3', () => {
  beforeEach(() => {
    sandbox.stub(s3, 'upload').resolves();
  });

  afterEach(() => sandbox.restore());

  experiment('when given zero rows', () => {
    let response;
    before(async () => {
      response = await generateCsv('test-report.csv', [], [{ name: 'somefield' }]);
    });
    test('returns null', () => {
      expect(response).to.equal(null);
    });
  });

  experiment('when given at least one row', () => {
    beforeEach(async () => {
      await generateCsv('test-report.csv', [{ somefield: 'somevalue' }], [{ name: 'somefield' }]);
    });
    test('attempts to upload data to S3', () => {
      expect(s3.upload.called).to.be.true();
    });
  });
});
