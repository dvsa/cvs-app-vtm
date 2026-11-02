import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class Button extends BaseComponent {
	constructor(scope: Page | Locator, id: string) {
		super(scope, id, ':is(button, a)');
	}

	async click(): Promise<void> {
		await this.locator.click();
	}
}
