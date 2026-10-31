import { BaseComponent } from './base.component';

export class Radios extends BaseComponent {
	async fill(value: string): Promise<void> {
		await this.locator.locator(`input[type="radio"][value=${JSON.stringify(value)}]`).check();
	}
}
