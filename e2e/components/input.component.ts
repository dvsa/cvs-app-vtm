import { BaseComponent } from './base.component';

export class Input extends BaseComponent {
	async fill(value: string): Promise<void> {
		await this.locator.fill(value);
	}
}
