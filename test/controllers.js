'use strict';

const Lab = require('@hapi/lab');
const { experiment, test, afterEach, before } = exports.lab = Lab.script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const reportFetcher = require('../src/lib/helpers/report-fetcher');
const { pool } = require('../src/lib/connectors/db');
const controllers = require('../src/controllers');

experiment('controllers', () => {
  afterEach(() => sandbox.restore());

  experiment('.getStatus', () => {
    experiment('when called', () => {
      let response;
      before(async () => {
        await sandbox.stub(pool, 'query').resolves({ rows: [], fields: [] });
        response = await controllers.getStatus();
      });
      test('calls the database with a query', () => {
        expect(pool.query.called).to.be.true();
      });
      test('returns an object', () => {
        expect(response).to.contain({ error: null });
      });
    });
  });

  experiment('.getReport', () => {
    experiment('when called', () => {
      let response;
      before(async () => {
        await sandbox.stub(reportFetcher, 'getObject').resolves({ readStream: 'bla' });
        response = await controllers.getReport({
          params: {
            reportKey: 'somereport'
          }
        });
      });
      test('calls the reports fetcher', () => {
        expect(reportFetcher.getObject.called).to.be.true();
      });
      test('returns the readStream', () => {
        expect(response).to.equal('bla');
      });
    });
  });
});
