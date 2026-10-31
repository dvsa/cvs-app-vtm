import { BaseComponent } from './base.component';

export class Radios extends BaseComponent {
	async fill(value: string | number | boolean): Promise<void> {
		await this.locator.locator(`input[type="radio"][value=${JSON.stringify(String(value))}]`).check();
	}
}
