import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class Input extends BaseComponent {
	constructor(scope: Page | Locator, id: string) {
		super(scope, id, ':is(input, textarea, select)');
	}

	async fill(value: string | number): Promise<void> {
		await this.locator.fill(String(value));
	}
}
