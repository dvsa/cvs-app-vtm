import { BaseComponent } from './base.component';

export class Button extends BaseComponent {
	async click(): Promise<void> {
		await this.locator.click();
	}
}
