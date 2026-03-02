import { formatHtmlId } from '../utils/formatters';
import { BaseComponent } from './base.component';
import { CheckboxComponent } from './checkbox.component';

export class CheckboxesComponent extends BaseComponent {
	readonly label = this.page.locator(`//*[@id="${this.id}"]`);
	readonly hint = this.page.locator(`//*[@id="${this.id}-hint"]`);
	readonly checkboxes = this.page.locator(`//*[@id="${this.id}"]//input[type="checkbox"]`);
	readonly inlineError = this.page.locator(`//*[@id="${this.id}-error"]`);
	readonly globalError = this.page.locator(`//*[@id="${this.id}-global-error"]`);

	async fill(data?: string[] | null): Promise<void> {
		if (!data) return;

		const locators = await this.checkboxes.all();
		for (const locator of locators) {
			// To ensure correct edits, first uncheck all checkboxes
			try {
				await locator.setChecked(false);
			} catch (error) {
				// @TODO: re-throw error if unexpected
			}
		}

		// Then check the checkboxes that should be checked
		for (const value of data) {
			const checkbox = new CheckboxComponent(this.page, formatHtmlId(`${this.id}-${value}`));
			await checkbox.fill(true);
		}
	}
}
