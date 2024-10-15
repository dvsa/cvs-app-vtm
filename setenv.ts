const { writeFile } = require('node:fs');
const { argv } = require('yargs');
const path = require('node:path');
const envFile = path.join(__dirname, `.env${argv.env ? `.${argv.env}` : ''}`);

// read environment variables from .env file
require('dotenv').config({
	path: path.resolve(envFile),
});

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction ? './src/environments/environment.prod.ts' : './src/environments/environment.deploy.ts';

// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `export const environment = {
    production: ${isProduction},
    TARGET_ENV: '${process.env['TARGET_ENV']}',
    RemoveAADFullAccessRole: ${process.env['RemoveAADFullAccessRole']},
    EnableDevTools: ${process.env['EnableDevTools']},
    VTM_CLIENT_ID: "${process.env['VTM_CLIENT_ID']}",
    VTM_AUTHORITY_ID: "${process.env['VTM_AUTHORITY_ID']}",
    VTM_REDIRECT_URI: "${process.env['VTM_REDIRECT_URI']}",
    VTM_API_URI: "${process.env['VTM_API_URI']}",
    VTM_API_CLIENT_ID: "${process.env['VTM_API_CLIENT_ID']}",
    LOGS_API_KEY: "${process.env['LOGS_API_KEY']}",
    DOCUMENT_RETRIEVAL_API_KEY: "${process.env['DOCUMENT_RETRIEVAL_API_KEY']}",
    FEEDBACK_URI: "${process.env['FEEDBACK_URI']}",
    SENTRY_DSN: "${process.env['SENTRY_DSN']}",
    VTM_GTM_CONTAINER_ID: "${process.env['VTM_GTM_CONTAINER_ID']}",
    VTM_GTM_MEASUREMENT_ID: "${process.env['VTM_GTM_MEASUREMENT_ID']}",
  };
  `;

const filesToWrite = [
	{
		path: targetPath,
		contents: environmentFileContent,
	},
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
