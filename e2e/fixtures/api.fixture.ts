import { test as base } from '@playwright/test';
import { TechnicalRecordsApi } from '../api/technical-records.api';

export { expect } from '@playwright/test';

export const test = base.extend<{ technicalRecordsApi: TechnicalRecordsApi }>({
	technicalRecordsApi: async ({ request, context, baseURL }, use) => {
		if (!baseURL) {
			throw new Error('API setup requires the Playwright baseURL to locate the authenticated browser origin.');
		}
		const state = await context.storageState();
		const accessToken = state.origins
			.find(({ origin }) => origin === new URL(baseURL).origin)
			?.localStorage.find(({ name }) => name === 'accessToken')?.value;
		if (!accessToken) {
			throw new Error('API setup requires an accessToken in the saved browser state. Run the login setup project.');
		}

		const environment = process.env['ENVIRONMENT'] ?? 'develop';
		const apiURLs: Record<string, string> = {
			develop: 'https://api.develop.cvs.dvsacloud.uk/develop',
			integration: 'https://api.integration.cvs.dvsacloud.uk/integration',
			dev1: 'https://vtmdev-1-api.develop.cvs.dvsacloud.uk/vtmdev-1',
			dev2: 'https://vtmdev-2-api.develop.cvs.dvsacloud.uk/vtmdev-2',
		};
		const apiBaseURL = process.env['API_BASE_URL'] ?? apiURLs[environment];
		if (!apiBaseURL) {
			throw new Error(`Unknown API ENVIRONMENT "${environment}". Set API_BASE_URL explicitly.`);
		}

		await use(new TechnicalRecordsApi(request, apiBaseURL, accessToken));
	},
});
