import { Account } from '@/e2e/types';
import { BasePage } from '../base.page';

export class SignInPage extends BasePage {
	readonly email = this.page.getByPlaceholder('Email, phone, or Skype');
	readonly password = this.page.getByPlaceholder('Password');

	readonly signInButton = this.page.getByRole('button', { name: 'Sign in' });
	readonly signOutButton = this.page.getByRole('button', { name: 'Sign out' });
	readonly nextButton = this.page.getByRole('button', { name: 'Next' });

	async signIn(account: Account) {
		await this.page.goto('/');
		await this.email.click();
		await this.email.fill(account.email);
		await this.nextButton.click();
		await this.password.click();
		await this.password.fill(account.password);
		await this.signInButton.click();
		await this.page.reload();
	}

	async signOut() {
		await this.signOutButton.click();
	}
}
