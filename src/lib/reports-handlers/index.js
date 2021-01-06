const reportHandlers = {
  billedLicencesReport: require('./billedLicencesReportHandler').handler,
  revokedUncreditedLicencesReport: require('./revokedUncreditedLicencesReportHandler').handler,
  unbilledLicencesReport: require('./unbilledLicencesReportHandler').handler
};

module.exports = reportHandlers;
