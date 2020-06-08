const { writeFile } = require('fs');
const { argv } = require('yargs');

require('dotenv').config();

const environment = argv.environment;

const isDev = environment === 'local';
const targetPath = isDev && `./src/environments/environment.ts`;

if(!isDev) throw new Error(`
  \n\n
  Please set your environment variable to 'local' to get started when running 'npm run config' \n
  --environment=local within your 'npm start' npm script
  \n\n
`);


const environmentFileContent = `
/**
* This file is generated dynamically with ./scripts/generateEnv.ts file and used for local development
* For further information about angular env config: https://angular.io/guide/build
**/

export const environment = {
  name: '${environment}',
  production: ${!isDev},
  debug: ${isDev},
  appInsights: {
    instrumentationKey: '#{appInsightsKey}'
  },
  logging: {
    console: true,
    appInsights: true
  },
  aad: {
    requireAuth: true,
    clientId: '${process.env.AZURE_CLIENT_ID}',
    tenant: '${process.env.AZURE_TENANT_ID}'
  },
  adalConfig: {
    clientId: '${process.env.AZURE_CLIENT_ID}',
    tenant: '${process.env.AZURE_TENANT_ID}',
    redirectUri: window.location.origin,
    cacheLocation: 'localStorage',
    endpoints: {
      api: ''
    }
  },
  apiServer: {
    APITechnicalRecordServerUri: '${process.env.API_ENDPOINT_LOCAL}',
    APITestResultServerUri: '${process.env.API_ENDPOINT_LOCAL}',
    APIDocumentsServerUri: 'assets/files',
    APIDocumentBlobUri: '${process.env.API_ENDPOINT_LOCAL}',
    APIPreparersServerUri: '${process.env.API_ENDPOINT_LOCAL}',
    APITestStationsServerUri: '${process.env.API_ENDPOINT_LOCAL}',
    APICertificatesBlobUri: '${process.env.API_ENDPOINT_LOCAL}',
    APITestTypesServerUri: '${process.env.API_ENDPOINT_LOCAL}'
  }
};
`;

writeFile(targetPath, environmentFileContent, (err) => {
   if (err) console.log(err);
   console.log(`Wrote variables to ${targetPath}`);
});
