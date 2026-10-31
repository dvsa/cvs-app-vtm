import { expect, test } from '@playwright/test';
import { PageFactory } from '../page-objects/page.factory';

test('restores the authenticated session created by login setup', async ({ page }) => {
	const pages = new PageFactory(page);
	await page.goto('/');

	await expect(pages.loginPage.techRecordSearchLink).toBeVisible();
	await expect(pages.loginPage.signOutBtn).toBeVisible();
	await expect(page).toHaveURL('/');
});
