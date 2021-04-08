'use strict';

const Lab = require('@hapi/lab');
const { experiment, test, afterEach, before } = exports.lab = Lab.script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const { pool } = require('../src/lib/connectors/db');
const controllers = require('../src/controllers');
const reportFetcher = require('../src/lib/helpers/report-fetcher');

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
    let response;
    experiment('when called', () => {
      before(async () => {
        await sandbox.stub(reportFetcher, 'getObject').resolves({
          statusCode: 200,
          headers: {
            someHeader: 'someValue'
          },
          readStream: Buffer.alloc(1, null, 'utf-8')
        });
        response = await controllers.getReport({
          params: {
            reportKey: 'someReport'
          }
        }, {
          status: sandbox.spy(),
          response: sandbox.stub().returns({
            code: sandbox.spy()
          })
        });
      });
      test('calls the report fetcher', () => {
        expect(reportFetcher.getObject.called).to.be.true();
      });
    });
  });
});
