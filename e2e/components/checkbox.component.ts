import { BaseComponent } from './base.component';

export class Checkbox extends BaseComponent {
	async fill(checked: boolean): Promise<void> {
		await this.locator.setChecked(checked);
	}
}
