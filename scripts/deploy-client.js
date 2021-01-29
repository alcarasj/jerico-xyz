/* eslint-disable @typescript-eslint/no-var-requires */

/* Script used in CircleCI for uploading production bundle. */
const ibmCos = require('ibm-cos-sdk'),
  fs = require('fs'),
  packageJSON = require('../package.json');

const { S3_HOST, IBM_CLOUD_API_KEY, BUCKET_NAME } = process.env,
  IAM_ENDPOINT = 'https://iam.cloud.ibm.com/identity/token',
  VERSION = packageJSON.version,
  COS_RESOURCE_NAME = 'jerico-cloud-storage',
  REQUIRED_PARAMS = { S3_HOST, IBM_CLOUD_API_KEY, BUCKET_NAME };

for (const [name, value] of Object.entries(REQUIRED_PARAMS)) {
  if (!value) {
    throw new Error(`${name} env var must be set but found: ${value}`);
  }
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

const main = () => {
  uploadFile(`bundle/main-${VERSION}.js`, `./static/bundle/bundle-${VERSION}/main.js`);
};

main();
