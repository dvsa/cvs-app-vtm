import { Page } from '@playwright/test';

export class BasePage {
	constructor(public page: Page) {}
}
