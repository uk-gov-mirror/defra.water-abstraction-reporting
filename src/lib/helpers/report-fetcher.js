const { getS3 } = require('../connectors/s3');
const { logger } = require('../../logger');

const s3 = getS3();

const getObject = (key) => {
  return new Promise((resolve, reject) => {
    // Get the file from the bucket
    s3.getObject({
      Bucket: process.env.S3_BUCKET,
      Key: 'reporting/' + key + '.csv'
    })
      .on('error', (err) => {
        return reject(err);
      })
      .on('httpHeaders', (statusCode, headers, response) => {
        // If the Key was found inside Bucket, prepare a response object
        if (statusCode === 200) {
          const responseObject = {
            statusCode: statusCode,
            headers: {
              'Content-Disposition': 'attachment; filename=' + key
            }
          };

          if (headers['content-type']) { responseObject.headers['Content-Type'] = headers['content-type']; }
          if (headers['content-length']) { responseObject.headers['Content-Length'] = headers['content-length']; }

          responseObject.readStream = response.httpResponse.createUnbufferedStream();
          return resolve(responseObject);
        }
      })
      .send();
  });
};

exports.getObject = getObject;
