import { expect, test } from '@playwright/test';

test('shows the login page to an unauthenticated user', async ({ page }) => {
	await page.goto('/login');

	await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
	await expect(page.getByText('Sign in to continue', { exact: true })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeEnabled();
	await expect(page).toHaveURL('/login');
});
