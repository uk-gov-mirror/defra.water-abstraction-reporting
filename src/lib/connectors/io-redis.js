'use strict';

const IORedis = require('ioredis');
const config = require('../../../config');
const { logger } = require('../../logger');

exports.createConnection = () => {
  const RedisInstance = new IORedis(config.redis);

  // Removes the existing Bull queues for report generation
  RedisInstance.keys('*Report*').then(function (keys) {
    logger.info(`Found ${keys.length} redis keys that are report-related. Deleting those now...`);
    const pipeline = RedisInstance.pipeline();
    keys.forEach(function (key) {
      pipeline.del(key);
    });
    return pipeline.exec();
  });
  return RedisInstance;
};
