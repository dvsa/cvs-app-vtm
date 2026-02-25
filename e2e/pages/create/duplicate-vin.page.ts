import { BasePage } from '../base.page';

export class DuplicateVinPage extends BasePage {
	readonly confirmButton = this.page.getByRole('button', { name: 'Confirm' });
	readonly backButton = this.page.getByRole('button', { name: 'Back' });

	async loaded(): Promise<void> {
		await this.page.waitForURL(/\/create\/duplicate-vin/);
		await expect(await this.page.title()).toBe('Vehicle Testing Management - Create new technical record');
	}
}
