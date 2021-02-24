'use strict';

const Lab = require('@hapi/lab');
const { experiment, test, beforeEach, afterEach, before } = exports.lab = Lab.script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();
const fs = require('await-fs');

const { generateCsv, s3 } = require('../../../src/lib/helpers/write-csv-to-s3');

experiment('lib/helpers/write-csv-to-s3', () => {
  beforeEach(() => {
    sandbox.stub(s3, 'upload').resolves();
    sandbox.stub(fs, 'writeFile');
  });

  afterEach(() => sandbox.restore());

  experiment('when given zero rows', () => {
    let response;
    before(async () => {
      response = await generateCsv('test-report-1.csv', [], [{ name: 'somefield' }]);
    });
    test('returns nothing', () => {
      expect(response).to.equal(null);
    });
    test('stores nothing', () => {
      expect(fs.writeFile.called).to.be.false();
    });
  });

  experiment('when given at least one row', () => {
    before(async () => {
      await generateCsv('test-report-2.csv', [{ somefield: 'somevalue' }], [{ name: 'somefield' }]);
    });
    test('stores a file', () => {
      expect(fs.writeFile.called).to.be.true();
    });
  });
});
