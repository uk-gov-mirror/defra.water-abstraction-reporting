'use strict';

const Lab = require('@hapi/lab');
const { experiment, test, beforeEach, afterEach, before } = exports.lab = Lab.script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const { pool } = require('../src/lib/connectors/db');
const controllers = require('../src/controllers');

experiment('controllers', () => {
  beforeEach(() => {
    // Stubbing here
  });

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
});
