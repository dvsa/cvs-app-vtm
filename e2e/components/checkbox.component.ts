import { BaseComponent } from './base.component';

export class Checkbox extends BaseComponent {
	constructor(scope: Page | Locator, id: string) {
		super(scope, id, 'input');
	}

	async fill(checked: boolean): Promise<void> {
		await this.locator.setChecked(checked);
	}
}
import { Locator, Page } from '@playwright/test';
