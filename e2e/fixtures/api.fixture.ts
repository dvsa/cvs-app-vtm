import { test as base } from '@playwright/test';
import { TechnicalRecordsApi } from '../api/technical-records.api';
import { TestResultsApi } from '../api/test-results.api';

export { expect } from '@playwright/test';

interface ApiFixtures {
	apiConfig: { baseURL: string; accessToken: string };
	technicalRecordsApi: TechnicalRecordsApi;
	testResultsApi: TestResultsApi;
}

export const test = base.extend<ApiFixtures>({
	apiConfig: async ({ context, baseURL }, use) => {
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

		await use({ baseURL: apiBaseURL.replace(/\/+$/, ''), accessToken });
	},
	technicalRecordsApi: async ({ request, apiConfig }, use) => {
		await use(new TechnicalRecordsApi(request, apiConfig.baseURL, apiConfig.accessToken));
	},
	testResultsApi: async ({ request, apiConfig }, use) => {
		await use(new TestResultsApi(request, apiConfig.baseURL, apiConfig.accessToken));
	},
});
