import { parseArgs } from 'node:util';

// Bun loads .env automatically; pass `--env-file=.env.<name>` to bun for other files.
const { values } = parseArgs({
	args: Bun.argv.slice(2),
	options: { environment: { type: 'string' } },
	strict: false,
});

const isProduction = values.environment === 'prod';
const targetPath = isProduction ? './src/environments/environment.prod.ts' : './src/environments/environment.deploy.ts';

const environmentFileContent = `export const environment = {
    production: ${isProduction},
    TARGET_ENV: '${Bun.env['TARGET_ENV']}',
    RemoveAADFullAccessRole: ${Bun.env['RemoveAADFullAccessRole']},
    EnableDevTools: ${Bun.env['EnableDevTools']},
    VTM_CLIENT_ID: "${Bun.env['VTM_CLIENT_ID']}",
    VTM_AUTHORITY_ID: "${Bun.env['VTM_AUTHORITY_ID']}",
    VTM_REDIRECT_URI: "${Bun.env['VTM_REDIRECT_URI']}",
    VTM_API_URI: "${Bun.env['VTM_API_URI']}",
    VTM_API_CLIENT_ID: "${Bun.env['VTM_API_CLIENT_ID']}",
    LOGS_API_KEY: "${Bun.env['LOGS_API_KEY']}",
    DOCUMENT_RETRIEVAL_API_KEY: "${Bun.env['DOCUMENT_RETRIEVAL_API_KEY']}",
    FEEDBACK_URI: "${Bun.env['FEEDBACK_URI']}",
    SENTRY_DSN: "${Bun.env['SENTRY_DSN']}",
    VTM_GTM_CONTAINER_ID: "${Bun.env['VTM_GTM_CONTAINER_ID']}",
    VTM_GTM_MEASUREMENT_ID: "${Bun.env['VTM_GTM_MEASUREMENT_ID']}",
  };
  `;

await Bun.write(targetPath, environmentFileContent);
console.log(`Wrote variables to ${targetPath}`);
