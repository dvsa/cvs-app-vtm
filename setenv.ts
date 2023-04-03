const { writeFile } = require('fs');
const { argv } = require('yargs');
const path = require('path');
const envFile = path.join(__dirname, `.env${argv.env ? '.' + argv.env : ''}`);

// read environment variables from .env file
require('dotenv').config({
  path: path.resolve(envFile)
});

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction ? `./src/environments/environment.prod.ts` : `./src/environments/environment.deploy.ts`;
const cypressPath = 'cypress.env.json';

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
    DOCUMENT_RETRIEVAL_API_KEY: "${process.env['DOCUMENT_RETRIEVAL_API_KEY']}"
  };
  `;

const cypressCredsFile = JSON.stringify({
  aad_username: process.env['AAD_USER'],
  aad_password: process.env['AAD_PASSWORD']
});

const filesToWrite = [
  {
    path: targetPath,
    contents: environmentFileContent
  },
  {
    path: cypressPath,
    contents: cypressCredsFile
  }
];

// write the content to the respective file
filesToWrite.forEach(({ path, contents }) => {
  writeFile(path, contents, (err: string) => {
    if (err) {
      console.log(err);
    }
    console.log(`Wrote variables to ${path}`);
  });
});
