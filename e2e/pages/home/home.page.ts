import { expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class HomePage extends BasePage {
	readonly searchTechRecordLink = this.page.getByRole('link', {
		name: 'Search for a technical record',
	});
	readonly createNewTechRecordLink = this.page.getByRole('link', {
		name: 'Create a new technical record',
	});
	readonly createBatchLink = this.page.getByRole('link', {
		name: 'Create a batch of technical records',
	});
	readonly refDataLink = this.page.getByRole('link', {
		name: 'Reference Data Administration',
	});
	readonly betasLink = this.page.getByRole('link', { name: 'Opt-in to betas' });

	async goto(): Promise<void> {
		await this.page.goto('/');
	}

	async loaded(): Promise<void> {
		await this.page.waitForLoadState('networkidle');
		await this.page.waitForLoadState('domcontentloaded');
		await expect(await this.page.title()).toBe('Vehicle Testing Management - Home');
	}
}
