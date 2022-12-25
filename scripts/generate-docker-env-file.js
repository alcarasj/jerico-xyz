/* eslint-disable @typescript-eslint/no-var-requires */

/* Script used for generating xyz.env file for use in Docker. */
const { writeFileSync } = require("fs");
const OUTPUT_PATH = "./xyz.env";
const { S3_HOST, IBM_CLOUD_API_KEY, BUCKET_NAME, PORT, CLOUDANT_HOST, MODE } = process.env;
const REQUIRED_PARAMS = { S3_HOST, IBM_CLOUD_API_KEY, BUCKET_NAME, PORT, CLOUDANT_HOST, MODE };

const main = () => {
  let content = "";
  for (const [name, value] of Object.entries(REQUIRED_PARAMS)) {
    if (!value) {
      throw new Error(`${name} env var must be set but found: ${value}`);
    }
    content += `${name}=${value}\n`
  }

  writeFileSync(OUTPUT_PATH, content);
  console.log(`Created ${OUTPUT_PATH} for Docker environment variables.`);
};

main();