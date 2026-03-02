import { BaseComponent } from './base.component';

export class AutoCompleteComponent extends BaseComponent {
	readonly label = this.page.locator(`//*[@id="${this.id}-label"]`);
	readonly hint = this.page.locator(`//*[@id="${this.id}-hint"]`);
	readonly input = this.page.locator(`//*[@id="${this.id}"]`);
	readonly inlineError = this.page.locator(`//*[@id="${this.id}-error"]`);
	readonly globalError = this.page.locator(`//*[@id="${this.id}-global-error"]`);

	async fill(data?: string | number | null): Promise<void> {
		if (!data) return;
		await this.input.fill(data.toString()); // filter options
		await this.page.locator(`//*[@id="${this.id}__option--0"]`).click(); // select first option
	}
}
