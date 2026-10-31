import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
	readonly emailInput = this.page.getByPlaceholder('Email, phone, or Skype');
	readonly nextBtn = this.page.getByRole('button', { name: 'Next', exact: true });
	readonly passwordInput = this.page.getByPlaceholder('Password', { exact: true });
	readonly loginBtn = this.page.getByRole('button', { name: 'Sign in', exact: true });
	readonly signOutBtn = this.page.locator('#sign-out');
	readonly techRecordSearchLink = this.page.getByRole('link', { name: 'Search for a technical record', exact: true });

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
