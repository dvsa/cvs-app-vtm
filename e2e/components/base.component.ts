import { Locator, Page } from '@playwright/test';

export abstract class BaseComponent {
	readonly locator: Locator;

	constructor(scope: Page | Locator, id: string) {
		this.locator = scope.locator(`[id=${JSON.stringify(id)}]`);
	}
}
