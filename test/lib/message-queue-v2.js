'use strict';

const { expect } = require('@hapi/code');
const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();
const sandbox = require('sinon').createSandbox();

const { plugin } = require('../../src/lib/message-queue-v2');
const ioRedis = require('../../src/lib/connectors/io-redis');

experiment('lib/message-queue-v2', () => {
  let server, connection;

  beforeEach(async () => {
    connection = {};
    sandbox.stub(ioRedis, 'createConnection').returns(connection);
    server = {
      decorate: sandbox.stub()
    };
  });

  afterEach(async () => {
    sandbox.restore();
  });

  test('has a register method', async () => {
    expect(plugin.register).to.be.a.function();
  });

  experiment('the plugin .register method', () => {
    beforeEach(async () => {
      await plugin.register(server);
    });

    test('the hapi server is decorated with the QueueManager instance', async () => {
      const [target, name] = server.decorate.firstCall.args;
      expect(target).to.equal('server');
      expect(name).to.equal('queueManager');
    });

    test('the hapi request is decorated with the QueueManager instance', async () => {
      const [target, name] = server.decorate.secondCall.args;
      expect(target).to.equal('request');
      expect(name).to.equal('queueManager');
    });
  });
});
