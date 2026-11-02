import { BaseComponent } from './base.component';

export class Radios extends BaseComponent {
	async fill(value: string | number | boolean): Promise<void> {
		const id = await this.locator.getAttribute('id');
		await this.locator
			.locator(
				`input[type="radio"]:is([value=${JSON.stringify(String(value))}], [id=${JSON.stringify(`${id}-${value}-radio`)}])`
			)
			.check();
	}
}
