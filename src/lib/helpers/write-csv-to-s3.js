const csvObjectWriter = require('csv-writer').createObjectCsvWriter;
const { getS3 } = require('../connectors/s3');
const { logger } = require('../../logger');
const fs = require('await-fs');

const s3 = getS3();

module.exports = {
  s3: s3, // exports s3 instance so it can be stubbed in testing
  generateCsv: async (filename, records, fields) => {
    logger.info('Writing file to S3: ' + filename);
    if (records.length > 1) {
      const filePath = `${process.env.PWD}/temp/${filename}`;

      const parsedFields = fields.map(field => {
        return {
          id: field.name,
          title: field.name
        };
      });

      await fs.writeFile(filePath, null);

      const csvWriter = csvObjectWriter({
        path: filePath,
        header: parsedFields
      });

      await csvWriter.writeRecords(records);

      return fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          throw err;
        }
        const params = {
          Bucket: process.env.S3_BUCKET,
          Key: 'reporting/' + filename,
          Body: data
        };

        return s3.upload(params, (s3Err, s3Data) => {
          if (s3Err) {
            throw s3Err;
          }
          logger.info(`File uploaded successfully at ${s3Data.Location}`);
        });
      });
    }
  }
};
