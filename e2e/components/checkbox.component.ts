import { BaseComponent } from './base.component';

export class CheckboxComponent extends BaseComponent {
	readonly label = this.page.locator(`//*[@id="${this.id}-label"]`);
	readonly checkbox = this.page.locator(`//*[@id="${this.id}-checkbox"]`);
	readonly inlineError = this.page.locator(`//*[@id="${this.id}-error"]`);
	readonly globalError = this.page.locator(`//*[@id="${this.id}-global-error"]`);

	async fill(data?: boolean | null): Promise<void> {
		try {
			await this.checkbox.setChecked(data === true);
		} catch (error) {
			// @TODO: re-throw error if unexpected
		}
	}
}
