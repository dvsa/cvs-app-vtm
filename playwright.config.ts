import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	timeout: 30_000,
	expect: {
		timeout: 5_000,
	},

	// Run in parallel by default
	fullyParallel: true,

	// Fail the build on CI if you accidentally left test.only in the code.
	forbidOnly: !!process.env['CI'],
	retries: process.env['CI'] ? 2 : 0,
	workers: process.env['CI'] ? 2 : undefined,

	// Use HTML reporter locally, dot on CI
	reporter: process.env['CI'] ? 'dot' : 'html',

	// Base URL for `page.goto('/')`
	use: {
		baseURL: 'http://localhost:4200',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
	},

	// Start Angular dev server before tests, reuse if already running
	webServer: {
		command: 'npm run start:test',
		url: 'http://localhost:4200',
		reuseExistingServer: !process.env['CI'],
		timeout: 120_000,
	},

	// Define projects (browsers)
	projects: [
		// Setup project
		{ name: 'setup', testMatch: /.*\.setup\.ts/ },

		{
			name: 'chromium',
			testMatch: '**/tests/**/*.spec.ts',
			use: { ...devices['Desktop Edge'], storageState: 'e2e/credentials/.auth/user.json' },
			dependencies: ['setup'],
		},
	],
});
