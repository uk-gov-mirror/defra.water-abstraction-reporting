// This file is for queueing up the reports repeatable jobs with Bull outside of the context of routes
const msgQueue = require('./lib/message-queue-v2');
const { logger } = require('./logger');
const { reportsCron } = require('../config');
const reportHandlers = require('./lib/reports-handlers');

const startReportsQueues = async () => {
  // BilledLicences report
  logger.info('Registering the messaging queue...');
  reportsCron.activeReports.map(async reportName => {
    await msgQueue.queueManager.register({
      jobName: reportName,
      handler: reportHandlers[reportName],
      hasScheduler: true,
      onComplete: (job) => {
        logger.info(`${job.name} ran successfully at ${new Date()}`);
      },
      onFailed: (job, err) => {
        logger.info(`${job.name} failed at ${new Date()}`);
      },
      createMessage: () => {
        return [reportName, {}, {
          repeat: {
            cron: reportsCron.cron[reportName]
          }
        }];
      }
    });

    logger.info('Adding a report runner for ' + reportName);
    await msgQueue.queueManager.add(reportName, {});
  });
};

exports.startReportsQueues = startReportsQueues;
