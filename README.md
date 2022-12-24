# [jerico-xyz](https://jerico.xyz) [![CircleCI](https://circleci.com/gh/alcarasj/jerico-xyz.svg?style=svg)](https://app.circleci.com/pipelines/github/alcarasj/jerico-xyz)
My personal website that I built from scratch (guess who loves to code?) :)

## Setup
1. Install Go 1.18 and Node LTS 16 on your machine.
1. Create an `.xyzrc` in the repo root for setting the required env vars (see Configuration section)
1. Install Node packages using `npm install`
1. Set the required env vars using `source .xyzrc` 
1. Start the Gin app with `make go` (this requires restart when changes are made in Go code)
1. Start the React webpack server with `make react-dev`

## Debugging
- For React app: insert `debugger` statement in code, and go to developer tools in browser.
- For Gin app: place breakpoint in VS Code, generate `launch.json` with `make go-debug-config`, and debug via `Run and Debug` in VS Code.

## Configuration
```
export S3_HOST='https://s3.eu-gb.cloud-object-storage.appdomain.cloud' 
export BUCKET_NAME='name-of-s3-bucket-for-uploading-static-files'
export PORT=8000
export IBM_CLOUD_API_KEY='ibm-cloud-service-id-api-key-secret-value'
export CLOUDANT_HOST='https://some-cloudant-host-bluemix.cloudantnosqldb.appdomain.cloud'
```

## Architecture
### Application
- The front-end is a Material UI React app written in TypeScript.
- The back-end is a Gin app written in Go.
- The database is NoSQL using Cloudant.  
### Platform
- The app is hosted on Heroku.
- Static files are uploaded and served using IBM Cloud Object Storage.
- The database is an IBM Cloud Cloudant instance.
- IBM Cloud service IDs and API keys are used to give CircleCI and the Gin app access to IBM Cloud Object Storage and Cloudant, respectively.
- A Heroku API key is used in CircleCI for continuously deploying the service.
### Testing
- E2E tests are written using Cypress and JavaScript.
### CI/CD
- Every master commit is automatically built, deployed, and E2E tested using CircleCI.
- E2E tests are executed daily using CircleCI.