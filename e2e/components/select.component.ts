import { BaseComponent } from './base.component';

export class SelectComponent extends BaseComponent {
	readonly label = this.page.locator(`//*[@id="${this.id}-label"]`);
	readonly hint = this.page.locator(`//*[@id="${this.id}-hint"]`);
	readonly select = this.page.locator(`//*[@id="${this.id}"]`);
	readonly inlineError = this.page.locator(`//*[@id="${this.id}-error"]`);
	readonly globalError = this.page.locator(`//*[@id="${this.id}-global-error"]`);

	async fill(data?: string | boolean | number | null): Promise<void> {
		if (!data) return;
		// Find the actual option value (as angular prefixes the value with the index)
		const value = await this.page.locator(`//*[@id="${this.id}-${data.toString()}"]`).getAttribute('value');
		await this.select.selectOption(value);
	}
}
