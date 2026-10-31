import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';
import { Input } from './input.component';

export class DateInput extends BaseComponent {
	readonly day: Input;
	readonly month: Input;
	readonly year: Input;
	readonly hour: Input;
	readonly minute: Input;

	constructor(scope: Page | Locator, id: string) {
		super(scope, id, 'div');
		this.day = new Input(this.locator, `${id}-day`);
		this.month = new Input(this.locator, `${id}-month`);
		this.year = new Input(this.locator, `${id}-year`);
		this.hour = new Input(this.locator, `${id}-hour`);
		this.minute = new Input(this.locator, `${id}-minute`);
	}

	async fill(value: string): Promise<void> {
		if (value === '') {
			await this.day.fill('');
			await this.month.fill('');
			await this.year.fill('');
			if (await this.hour.locator.count()) await this.hour.fill('');
			if (await this.minute.locator.count()) await this.minute.fill('');
			return;
		}
		const match = /^(\d{4}-\d{2}-\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(?:Z|[+-](\d{2}):(\d{2}))?)?$/.exec(
			value
		);
		if (!match) {
			throw new Error(`Expected an ISO date or date/time string, received "${value}".`);
		}
		const date = new Date(`${match[1]}T00:00:00Z`);
		if (
			Number.isNaN(date.getTime()) ||
			date.toISOString().slice(0, 10) !== match[1] ||
			Number(match[2] ?? 0) > 23 ||
			Number(match[3] ?? 0) > 59 ||
			Number(match[4] ?? 0) > 59 ||
			Number(match[5] ?? 0) > 23 ||
			Number(match[6] ?? 0) > 59
		) {
			throw new Error(`Invalid date "${value}".`);
		}
		await this.day.fill(date.getUTCDate());
		await this.month.fill(date.getUTCMonth() + 1);
		await this.year.fill(date.getUTCFullYear());
		if (match[2] !== undefined && (await this.hour.locator.count())) await this.hour.fill(Number(match[2]));
		if (match[3] !== undefined && (await this.minute.locator.count())) await this.minute.fill(Number(match[3]));
	}
}
