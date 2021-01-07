const testMode = parseInt(process.env.TEST_MODE) === 1;
const isAcceptanceTestTarget = ['local', 'dev', 'development', 'test', 'qa', 'preprod'].includes(process.env.NODE_ENV);

const isLocal = process.env.NODE_ENV === 'local';

module.exports = {
  blipp: {
    showAuth: true
  },
  jwt: {
    key: process.env.JWT_SECRET,
    verifyOptions: { algorithms: ['HS256'] }
  },
  logger: {
    level: testMode ? 'info' : 'error',
    airbrakeKey: process.env.ERRBIT_KEY,
    airbrakeHost: process.env.ERRBIT_SERVER,
    airbrakeLevel: 'error'
  },
  pg: {
    connectionString: process.env.DATABASE_URL,
    max: 5
  },

  s3: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    region: 'eu-west-1',
    bucket: process.env.S3_BUCKET
  },

  server: {
    port: 8009,
    router: {
      stripTrailingSlash: true
    }
  },

  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    ...!(isLocal) && { tls: {} },
    db: 3
  },

  good: {
    ops: {
      interval: 10000
    }
  },

  reportsCron: {
    activeReports: [
      'unbilledLicencesReport',
      'billedLicencesReport',
      'revokedUncreditedLicencesReport'
    ],
    cron:
        {
          unbilledLicencesReport: '0 */12 * * *',
          billedLicencesReport: '15 */12 * * *',
          revokedUncreditedLicencesReport: '30 */12 * * *'
        }
  },

  isAcceptanceTestTarget
};
