import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import path from 'node:path';

const environment = process.env['ENVIRONMENT'] ?? 'develop';
const environmentURLs: Record<string, string> = {
	develop: 'https://vtm.develop.cvs.dvsacloud.uk',
	integration: 'https://vtm.integration.cvs.dvsacloud.uk',
	dev1: 'https://vtm-vtmdev-1.develop.cvs.dvsacloud.uk',
	dev2: 'https://vtm-vtmdev-2.develop.cvs.dvsacloud.uk',
};
const baseURL = process.env['BASE_URL'] ?? environmentURLs[environment];
if (!baseURL) {
	throw new Error(`Unknown ENVIRONMENT "${environment}". Set BASE_URL explicitly.`);
}
const startServer = process.env['E2E_START_SERVER'] === 'true';
if (startServer && new URL(baseURL).origin !== 'http://localhost:4200') {
	throw new Error('E2E_START_SERVER requires BASE_URL=http://localhost:4200.');
}

export default defineConfig({
	testDir: './e2e',
	forbidOnly: !!process.env['CI'],
	retries: process.env['CI'] ? 2 : 0,
	workers: 1,
	reporter: [['list'], ['html', { open: 'never' }]],
	expect: { timeout: 30_000 },
	webServer: startServer
		? {
				command: 'npm run start:e2e',
				url: 'http://localhost:4200/login',
				reuseExistingServer: false,
				timeout: 120_000,
			}
		: undefined,
	use: {
		baseURL,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	projects: [
		{
			name: 'setup',
			testMatch: '**/global.setup.ts',
			timeout: 120_000,
			use: {
				...devices['Desktop Chrome'],
				trace: 'off',
				screenshot: 'off',
				video: 'off',
			},
		},
		{
			name: 'chromium',
			testMatch: '**/*.spec.ts',
			dependencies: ['setup'],
			use: {
				...devices['Desktop Chrome'],
				storageState: path.resolve(__dirname, 'e2e/creds/.auth/fullAccess.json'),
			},
		},
	],
});
