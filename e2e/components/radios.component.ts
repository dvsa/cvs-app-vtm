import { BaseComponent } from './base.component';
import { RadioComponent } from './radio.component';

export class RadiosComponent extends BaseComponent {
	readonly label = this.page.locator(`//*[@id="${this.id}"]`);
	readonly hint = this.page.locator(`//*[@id="${this.id}-hint"]`);
	readonly inlineError = this.page.locator(`//*[@id="${this.id}-error"]`);
	readonly globalError = this.page.locator(`//*[@id="${this.id}-global-error"]`);

	getRadio(value: string): RadioComponent {
		return new RadioComponent(this, value);
	}

	async selectOption(value: string): Promise<void> {
		await this.getRadio(value).radio.click();
	}

	async fill(data?: string | boolean | number | null): Promise<void> {
		if (!data) return;
		await this.selectOption(data.toString());
	}
}
