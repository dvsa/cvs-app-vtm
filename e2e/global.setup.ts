import { existsSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { test as setup } from '@playwright/test';
import { LoginPage } from './page-objects/login-page';

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

setup('login - fullAccess', async ({ page, baseURL }) => {
	if (!baseURL) {
		throw new Error('Login setup requires a configured baseURL.');
	}
	const credentialsPath = path.resolve(__dirname, 'creds/app-credential.json');
	if (!existsSync(credentialsPath)) {
		throw new Error('Missing e2e/creds/app-credential.json. Copy app-credential-dummy.json and populate it locally.');
	}

	const contents = await readFile(credentialsPath, 'utf8');
	let credentials: unknown;
	try {
		credentials = JSON.parse(contents);
	} catch (error) {
		if (error instanceof SyntaxError) {
			throw new Error('Invalid JSON in e2e/creds/app-credential.json. Check the file contents.');
		}
		throw error;
	}

	const environment = process.env['ENVIRONMENT'] ?? 'develop';
	const environments = isRecord(credentials) ? credentials['Environment'] : undefined;
	const accounts = isRecord(environments) ? environments[environment] : undefined;
	const account = isRecord(accounts) ? accounts['fullAccess'] : undefined;
	if (
		!isRecord(account) ||
		typeof account['userName'] !== 'string' ||
		!account['userName'].trim() ||
		typeof account['password'] !== 'string' ||
		!account['password']
	) {
		throw new Error(`Configure Environment.${environment}.fullAccess with a non-empty userName and password.`);
	}

	await new LoginPage(page).logIn(account['userName'], account['password'], baseURL);
	await page.evaluate(() => window.localStorage.setItem('isAutomation', 'true'));

	const authDirectory = path.resolve(__dirname, 'creds/.auth');
	await mkdir(authDirectory, { recursive: true });
	await page.context().storageState({ path: path.join(authDirectory, 'fullAccess.json') });
});
