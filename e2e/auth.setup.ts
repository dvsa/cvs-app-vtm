import path from 'node:path';
import { test as setup } from '@playwright/test';
import * as accounts from './credentials/accounts.json';
import { SignInPage } from './pages/sign-in/sign-in.page';
import { Account } from './types';

const authFile = path.join(__dirname, './credentials/.auth/user.json');

function acquireAccount(id: number): Account {
	return accounts['develop'].fullAccess[id];
}

setup('authenticate', async ({ page }) => {
	const signInPage = new SignInPage(page);
	await signInPage.signIn(acquireAccount(0));
	await page.waitForURL('http://localhost:4200');
	await page.waitForLoadState('networkidle');
	await page.context().storageState({ path: authFile });
});
