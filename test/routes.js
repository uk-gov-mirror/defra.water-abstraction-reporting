'use strict';

const Lab = require('@hapi/lab');
const { experiment, test, beforeEach, afterEach } = exports.lab = Lab.script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const { getStatus, getReport } = require('../src/controllers');
const routes = require('../src/routes');

experiment('routes', () => {
  beforeEach(() => {
    // Stubbing here
  });

  afterEach(() => sandbox.restore());

  experiment('/status', () => {
    const statusRoute = routes.find(x => x.path === '/status');
    test('has the correct method', () => {
      expect(statusRoute.method).to.equal('GET');
    });

    test('has the correct handler', () => {
      expect(statusRoute.handler).to.equal(getStatus);
    });

    test('does not require auth', () => {
      expect(statusRoute.options.auth).to.equal(false);
    });
  });

  experiment('/reporting/1.0/report/{reportKey}', () => {
    const statusRoute = routes.find(x => x.path === '/reporting/1.0/report/{reportKey}');
    test('has the correct method', () => {
      expect(statusRoute.method).to.equal('GET');
    });

    test('has the correct handler', () => {
      expect(statusRoute.handler).to.equal(getReport);
    });
  });
});
