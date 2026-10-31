import { Locator, Page } from '@playwright/test';

export abstract class BaseComponent {
	readonly locator: Locator;

	constructor(scope: Page | Locator, id: string, element = '*') {
		this.locator = scope.locator(`${element}[id=${JSON.stringify(id)}]`);
	}
}
