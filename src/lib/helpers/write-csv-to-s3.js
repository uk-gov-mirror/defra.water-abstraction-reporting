const csvObjectWriter = require('csv-writer').createObjectCsvWriter;
const { getS3 } = require('../connectors/s3');
const { logger } = require('../../logger');
const fs = require('await-fs');
const awaitfs = require('await-fs');

const s3 = getS3();

module.exports = {
  s3: s3, // exports s3 instance so it can be stubbed in testing
  generateCsv: async (filename, records, fields) => {
    logger.info('Writing file to S3: ' + filename);
    if (records.length > 0) {
      const filePath = process.env.PWD + '/temp/' + filename;
      const parsedFields = fields.map(field => {
        return {
          id: field.name,
          title: field.name
        };
      });
      fs.writeFile(filePath, null);

      const csvWriter = csvObjectWriter({
        path: filePath,
        header: parsedFields
      });

      await csvWriter.writeRecords(records);
      const fileBuffer = await awaitfs.readFile(filePath);
      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: 'reporting/' + filename,
        Body: JSON.stringify(fileBuffer, null, 2)
      };

      s3.upload(params, function (err, data) {
        if (err) {
          logger.error(err);
          throw err;
        }
        logger.info(`File uploaded successfully at ${data.Location}`);
      });
    } else {
      return null;
    }
  }
};
