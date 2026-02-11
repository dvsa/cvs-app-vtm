import { BaseComponent } from './base.component';

export class DateInputComponent extends BaseComponent {
	readonly dayInput = this.page.locator(`//*[@id="${this.id}-day"]`);
	readonly monthInput = this.page.locator(`//*[@id="${this.id}-month"]`);
	readonly yearInput = this.page.locator(`//*[@id="${this.id}-year"]`);
	readonly hoursInput = this.page.locator(`//*[@id="${this.id}-hours"]`);
	readonly minutesInput = this.page.locator(`//*[@id="${this.id}-minutes"]`);
	readonly secondsInput = this.page.locator(`//*[@id="${this.id}-seconds"]`);
	readonly inlineError = this.page.locator(`//*[@id="${this.id}-error"]`);
	readonly globalError = this.page.locator(`//*[@id="${this.id}-global-error"]`);

	async fillInputs(data: DateInputFill): Promise<void> {
		if (data.days && (await this.dayInput.isVisible())) {
			await this.dayInput.fill(data.days.toString());
		}

		if (data.months && (await this.monthInput.isVisible())) {
			await this.monthInput.fill(data.months.toString());
		}

		if (data.years && (await this.yearInput.isVisible())) {
			await this.yearInput.fill(data.years.toString());
		}

		if (data.hours && (await this.hoursInput.isVisible())) {
			await this.hoursInput.fill(data.hours.toString());
		}

		if (data.minutes && (await this.minutesInput.isVisible())) {
			await this.minutesInput.fill(data.minutes.toString());
		}

		if (data.seconds && (await this.secondsInput.isVisible())) {
			await this.secondsInput.fill(data.seconds.toString());
		}
	}

	async fill(data?: string | null): Promise<void> {
		if (!data) return;

		const date = new Date(data);

		await this.fillInputs({
			days: date.getDate(),
			months: date.getMonth() + 1,
			years: date.getFullYear(),
			hours: date.getHours(),
			minutes: date.getMinutes(),
			seconds: date.getSeconds(),
		});
	}
}

export type DateInputFill = {
	days?: number;
	months?: number;
	years?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
};
