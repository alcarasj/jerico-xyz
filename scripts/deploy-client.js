/* eslint-disable @typescript-eslint/no-var-requires */

/* Script used in CircleCI for uploading production bundle. */
const ibmCos = require('ibm-cos-sdk'),
  fs = require('fs'),
  packageJSON = require('../package.json');

const IAM_ENDPOINT = 'https://iam.cloud.ibm.com/identity/token',
  VERSION = packageJSON.version,
  COS_RESOURCE_NAME = 'jerico-cloud-storage';

if (!process.env.S3_HOST || !process.env.IBM_CLOUD_API_KEY || !process.env.BUCKET_NAME) {
  throw new Error('S3_HOST, IBM_CLOUD_API_KEY and BUCKET_NAME must be set.');
}

const cosClient = new ibmCos.S3({
  endpoint: process.env.S3_HOST,
  apiKeyId: process.env.IBM_CLOUD_API_KEY,
  ibmAuthEndpoint: IAM_ENDPOINT,
  serviceInstanceId: COS_RESOURCE_NAME
});

const uploadFile = (objectPath, localFilePath) => 
  cosClient.putObject({
    Bucket: process.env.BUCKET_NAME, 
    Key: objectPath, 
    Body: fs.createReadStream(localFilePath)
  }).promise()
    .then(() => console.log(`Successfully uploaded ${localFilePath} to bucket ${process.env.BUCKET_NAME} at path ${objectPath}`))
    .catch(error => console.error(`Error uploading to bucket: ${error.code} - ${error.message}`));

uploadFile(`bundle/main-${VERSION}.js`, `./static/bundle/bundle-${VERSION}/main.js`);