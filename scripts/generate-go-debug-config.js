/* eslint-disable @typescript-eslint/no-var-requires */

/* Script used for generating launch.json for Go debugging in VSCode. */
const { writeFileSync, existsSync, mkdirSync } = require("fs");
const OUTPUT_FOLDER = "./.vscode";
const OUTPUT_PATH = `${OUTPUT_FOLDER}/launch.json`;
const { S3_HOST, IBM_CLOUD_API_KEY, BUCKET_NAME, PORT, CLOUDANT_HOST } = process.env;
const REQUIRED_PARAMS = { S3_HOST, IBM_CLOUD_API_KEY, BUCKET_NAME, PORT, CLOUDANT_HOST };

const main = () => {
  const env = {};
  for (const [name, value] of Object.entries(REQUIRED_PARAMS)) {
    if (!value) {
      throw new Error(`${name} env var must be set but found: ${value}`);
    }
    env[name] = value;
  }

  const launchJSON = {
    version: "0.2.0",
    configurations: [
      {
        name: "Launch Package",
        type: "go",
        request: "launch",
        mode: "auto",
        program: "${workspaceFolder}/api",
        cwd: "${workspaceFolder}",
        env: { ...env }
      }
    ]
  };
  if (!existsSync(OUTPUT_FOLDER)) {
    mkdirSync(OUTPUT_FOLDER);
  }
  writeFileSync(OUTPUT_PATH, JSON.stringify(launchJSON));
  console.log(`Created ${OUTPUT_PATH} for Go debugging.`);
};

main();