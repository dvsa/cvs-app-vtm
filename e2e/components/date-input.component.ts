import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';
import { Input } from './input.component';

export class DateInput extends BaseComponent {
	readonly day: Input;
	readonly month: Input;
	readonly year: Input;

	constructor(scope: Page | Locator, id: string) {
		super(scope, id, 'div');
		this.day = new Input(this.locator, `${id}-day`);
		this.month = new Input(this.locator, `${id}-month`);
		this.year = new Input(this.locator, `${id}-year`);
	}

	async fill(value: string): Promise<void> {
		if (value === '') {
			await this.day.fill('');
			await this.month.fill('');
			await this.year.fill('');
			return;
		}
		if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
			throw new Error(`Expected a date in YYYY-MM-DD format, received "${value}".`);
		}
		const date = new Date(`${value}T00:00:00Z`);
		if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
			throw new Error(`Invalid date "${value}".`);
		}
		await this.day.fill(date.getUTCDate());
		await this.month.fill(date.getUTCMonth() + 1);
		await this.year.fill(date.getUTCFullYear());
	}
}
