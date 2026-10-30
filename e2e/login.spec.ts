import { expect, test } from '@playwright/test';
import { LoginPage } from './page-objects/login-page';

test('restores the authenticated session created by login setup', async ({ page }) => {
	const loginPage = new LoginPage(page);
	await page.goto('/');

	await expect(loginPage.techRecordSearchLink).toBeVisible();
	await expect(loginPage.signOutBtn).toBeVisible();
	await expect(page).toHaveURL('/');
});
