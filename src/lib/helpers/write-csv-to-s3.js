const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const { getS3 } = require('../connectors/s3');
const { logger } = require('../../logger');
const fs = require('fs');

const s3 = getS3();

module.exports = {
  generateCsv: (filename, records, fields) => {
    logger.info('Writing file to S3: ' + filename);

    if (records.length > 0) {
      const csvStringifier = createCsvStringifier({
        header: fields.map(field => {
          return {
            id: field.name,
            title: field.name
          };
        })
      });

      const csv = csvStringifier.stringifyRecords(records);
      const filePath = process.env.PWD + '/temp/' + filename;
      fs.writeFileSync(filePath, csv);

      fs.readFile(filePath, (err, data) => {
        if (err) throw err;
        const params = {
          Bucket: process.env.S3_BUCKET,
          Key: 'reporting/' + filename,
          Body: JSON.stringify(data, null, 2)
        };
        s3.upload(params, function (s3Err, data) {
          if (s3Err) throw s3Err;
          console.log(`File uploaded successfully at ${data.Location}`);
        });
      });
    } else {
      return null;
    }
  }
};
