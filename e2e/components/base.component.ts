import { Page } from '@playwright/test';

export abstract class BaseComponent {
	constructor(
		public page: Page,
		public id?: string
	) {}
}
