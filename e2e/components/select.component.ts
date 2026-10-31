import { BaseComponent } from './base.component';

export class Select extends BaseComponent {
	async fill(value: string): Promise<void> {
		await this.locator.selectOption(value);
	}
}
