import { BasePage } from '../base.page';

export class AccessibilityStatementPage extends BasePage {
	async goto(): Promise<void> {
		await this.page.goto('/accessibility');
	}

	async loaded(): Promise<void> {
		await this.page.waitForURL(/\/accessibility/);
		await expect(await this.page.title()).toBe('Vehicle Testing Management - Accessibility statement');
	}
}
