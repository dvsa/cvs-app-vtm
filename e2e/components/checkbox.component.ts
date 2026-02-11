import { BaseComponent } from './base.component';

export class CheckboxComponent extends BaseComponent {
	readonly label = this.page.locator(`//*[@id="${this.id}-label"]`);
	readonly checkbox = this.page.locator(`//*[@id="${this.id}-checkbox"]`);
	readonly inlineError = this.page.locator(`//*[@id="${this.id}-error"]`);
	readonly globalError = this.page.locator(`//*[@id="${this.id}-global-error"]`);

	async fill(data?: boolean | null): Promise<void> {
		if (data === true) await this.checkbox.check();
		if (data === false || data === null) await this.checkbox.uncheck();
	}
}
