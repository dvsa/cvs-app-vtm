import { Page } from '@playwright/test';

export class BaseComponent {
	constructor(
		public page: Page,
		public id: string
	) {}
}
