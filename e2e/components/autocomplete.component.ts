import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class Autocomplete extends BaseComponent {
	constructor(scope: Page | Locator, id: string) {
		super(scope, id, 'input');
	}

	readonly value = (): Promise<string> => this.locator.inputValue();

	async fill(value: string): Promise<void> {
		await this.locator.fill(value);
		await this.locator.locator('..').getByRole('option', { name: value, exact: true }).click();
	}
}
