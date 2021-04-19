// This file is for queueing up the reports repeatable jobs with Bull outside of the context of routes
const msgQueue = require('./lib/message-queue-v2');
const { logger } = require('./logger');
const { reportsCron } = require('../config');
const { handler } = require('./lib/helpers/report-handler');

const startReportsQueues = () => {
  // BilledLicences report
  logger.info('Registering the messaging queue...');
  reportsCron.activeReports.forEach(reportName => {
    msgQueue.queueManager.register({
      jobName: reportName,
      handler: () => handler(reportName),
      hasScheduler: true,
      onComplete: job => {
        logger.info(`${job.name} ran successfully at ${new Date()}`);
      },
      onFailed: (job, err) => {
        logger.info(`${job.name} failed at ${new Date()}`, err);
      },
      createMessage: () => [reportName, {}, {
        repeat: {
          cron: reportsCron.cron[reportName]
        }
      }]
    });

    logger.info('Adding a report runner for ' + reportName);
    msgQueue.queueManager.add(reportName, {});
  });
};

exports.startReportsQueues = startReportsQueues;
