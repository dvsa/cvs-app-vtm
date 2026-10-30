import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	forbidOnly: !!process.env['CI'],
	retries: process.env['CI'] ? 2 : 0,
	workers: 1,
	reporter: [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL: 'http://127.0.0.1:4201',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: {
		command: 'npm run start:e2e',
		url: 'http://127.0.0.1:4201/login',
		reuseExistingServer: false,
		timeout: 120_000,
	},
});
