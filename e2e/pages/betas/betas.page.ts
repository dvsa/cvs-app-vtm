import { CheckboxComponent } from '@/e2e/components/checkbox.component';
import { expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class BetasPage extends BasePage {
	// Form controls
	readonly techRecordRedesignCheckbox = new CheckboxComponent(this.page, 'techrecordredesigncreatedetails');

	// Actions
	readonly cancelButton = this.page.getByRole('button', { name: 'Cancel' });
	readonly savePreferencesButton = this.page.getByRole('button', {
		name: 'Save preferences',
	});

	async goto(): Promise<void> {
		await this.page.goto('/betas');
	}

	async loaded(): Promise<void> {
		await this.page.waitForURL(/betas/);
		await expect(await this.page.title()).toBe('Vehicle Testing Management - Betas');
	}
}
