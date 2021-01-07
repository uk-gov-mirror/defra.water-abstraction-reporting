'use strict';

const Lab = require('@hapi/lab');
const { experiment, test, beforeEach, afterEach, before } = exports.lab = Lab.script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const { getFinancialYear } = require('../../../src/lib/helpers/financial-year');

experiment('lib/helpers/financial-year', () => {
  beforeEach(() => {
    // Stubbing here
  });

  afterEach(() => sandbox.restore());

  experiment('.getFinancialYear', () => {
    let response;
    experiment('when given a date of 01/01/2020', () => {
      before(() => {
        response = getFinancialYear(new Date('01/01/2020'));
      });
      test('returns 2020', () => {
        expect(response).to.equal(2020);
      });
    });

    experiment('when given a date of 30/03/2020', () => {
      before(() => {
        response = getFinancialYear(new Date('03/30/2020'));
      });
      test('returns 2020', () => {
        expect(response).to.equal(2020);
      });
    });

    experiment('when given a date of 01/04/2020', () => {
      before(() => {
        response = getFinancialYear(new Date('04/01/2020'));
      });
      test('returns 2020', () => {
        expect(response).to.equal(2021);
      });
    });

    experiment('when given an undefined date', () => {
      before(() => {
        response = getFinancialYear();
      });
      test('returns a financial year based on today\'s date', () => {
        expect(response.toString()).to.startsWith('20');
      });
    });
  });
});
