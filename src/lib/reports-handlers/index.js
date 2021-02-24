const reportHandlers = {
  billedActiveLicencesReport: require('./billedActiveLicencesReportHandler').handler,
  uncreditedInactiveLicencesReport: require('./uncreditedInactiveLicencesReportHandler').handler,
  unbilledActiveLicencesReport: require('./unbilledActiveLicencesReportHandler').handler
};

module.exports = reportHandlers;
