import { BaseComponent } from './base.component';

export class CheckboxesComponent extends BaseComponent {
	readonly label = this.page.locator(`//*[@id="${this.id}"]`);
	readonly hint = this.page.locator(`//*[@id="${this.id}-hint"]`);
	readonly inlineError = this.page.locator(`//*[@id="${this.id}-error"]`);
	readonly globalError = this.page.locator(`//*[@id="${this.id}-global-error"]`);

	async fill(data?: string[] | null): Promise<void> {
		if (!data) return;
	}
}
