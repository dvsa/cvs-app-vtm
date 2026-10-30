import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
	readonly emailInput: Locator;
	readonly nextBtn: Locator;
	readonly passwordInput: Locator;
	readonly loginBtn: Locator;
	readonly signOutBtn: Locator;
	readonly techRecordSearchLink: Locator;

	constructor(readonly page: Page) {
		this.emailInput = page.getByPlaceholder('Email, phone, or Skype');
		this.nextBtn = page.getByRole('button', { name: 'Next', exact: true });
		this.passwordInput = page.getByPlaceholder('Password', { exact: true });
		this.loginBtn = page.getByRole('button', { name: 'Sign in', exact: true });
		this.signOutBtn = page.locator('#sign-out');
		this.techRecordSearchLink = page.getByRole('link', { name: 'Search for a technical record', exact: true });
	}

	async logIn(userEmail: string, password: string, baseURL: string): Promise<void> {
		await this.page.goto('/');
		await this.emailInput.fill(userEmail);
		await this.nextBtn.click();
		await this.passwordInput.fill(password);
		await this.loginBtn.click();
		// Wait for Azure to return before refreshing the app to hydrate the local session.
		await this.page.waitForURL(new URL('/', baseURL).href);
		await this.page.reload();
		await expect(this.techRecordSearchLink).toBeVisible();
	}

	async signOut(): Promise<void> {
		await expect(this.signOutBtn).toBeVisible();
		await this.signOutBtn.click();
	}
}
