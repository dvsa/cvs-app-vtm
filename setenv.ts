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
  RemoveAADFullAccessRole: ${process.env['RemoveAADFullAccessRole']},
  EnableDevTools: ${process.env['EnableDevTools']},
  VTM_CLIENT_ID: "${process.env['VTM_CLIENT_ID']}",
  VTM_AUTHORITY_ID: "${process.env['VTM_AUTHORITY_ID']}",
  VTM_REDIRECT_URI: "${process.env['VTM_REDIRECT_URI']}",
  VTM_API_URI: "${process.env['VTM_API_URI']}",
  VTM_API_CLIENT_ID: "${process.env['VTM_API_CLIENT_ID']}",
};
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err: string) {
  if (err) {
    console.log(err);
  }
  console.log(`Wrote variables to ${targetPath}`);
});
