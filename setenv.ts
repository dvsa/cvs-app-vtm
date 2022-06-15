const { writeFile } = require('fs');
const { argv } = require('yargs');
// read environment variables from .env file
require('dotenv').config();
// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction ? `./src/environments/environment.prod.ts` : `./src/environments/environment.deploy.ts`;
// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `export const environment = {
  production: ${isProduction},
  VTM_CLIENT_ID: "${process.env['VTM_CLIENT_ID']}",
  VTM_AUTHORITY_ID: "${process.env['VTM_AUTHORITY_ID']}",
  VTM_REDIRECT_URI: 'http://localhost:4200',
  VTM_API_URI: 'https://api.develop.cvs.dvsacloud.uk/develop',
  VTM_API_CLIENT_ID: "${process.env['VTM_API_CLIENT_ID']}",
  VTM_TEST_RESULTS_API_URI: 'https://api.develop.cvs.dvsacloud.uk/develop',
};
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err: string) {
  if (err) {
    console.log(err);
  }
  console.log(`Wrote variables to ${targetPath}`);
});
