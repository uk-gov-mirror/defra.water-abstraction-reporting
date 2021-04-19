const { getS3 } = require('../connectors/s3');

const s3 = getS3();

module.exports = {
  s3,
  getObject: key => new Promise((resolve, reject) => {
    // Get the file from the bucket
    s3.getObject({
      Bucket: process.env.S3_BUCKET,
      Key: `reporting/${key}.csv`
    })
      .on('error', err => reject(err))
      .on('httpHeaders', (statusCode, headers, response) => {
        // If the Key was found inside Bucket, prepare a response object
        if (statusCode === 200) {
          return resolve({ readStream: response.httpResponse.createUnbufferedStream() });
        }
        return reject(new Error('Something went wrong when attempting to fetch the report from storage'));
      })
      .send();
  })
};
