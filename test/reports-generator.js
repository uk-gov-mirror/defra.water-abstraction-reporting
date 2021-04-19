'use strict';

const Lab = require('@hapi/lab');
const { experiment, test, after, before } = exports.lab = Lab.script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const { queueManager } = require('../src/lib/message-queue-v2');
const reportsGenerator = require('../src/reports-generator');

experiment('/src/reports-generator', () => {
  before(() => {
    sandbox.stub(queueManager, 'register').resolves();
    sandbox.stub(queueManager, 'add').resolves();
  });
  after(() => sandbox.restore());

  experiment('.startReportsQueues', () => {
    experiment('when called', () => {
      before(() => reportsGenerator.startReportsQueues());
      test('registers the reports jobs', () => {
        expect(queueManager.register.called).to.be.true();
      });
      test('adds the reports jobs', () => {
        expect(queueManager.add.called).to.be.true();
      });
    });
  });
});
