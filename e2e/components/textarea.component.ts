import { BaseComponent } from './base.component';

export class TextareaComponent extends BaseComponent {
	readonly hint = this.page.locator(`//*[@id="${this.id}-hint"]`);
	readonly label = this.page.locator(`//*[@id="${this.id}-label"]`);
	readonly textarea = this.page.locator(`//*[@id="${this.id}"]`);
	readonly inlineError = this.page.locator(`//*[@id="${this.id}-error"]`);
	readonly globalError = this.page.locator(`//*[@id="${this.id}-global-error"]`);

	async fill(data?: string | number | null): Promise<void> {
		if (!data) return;
		await this.textarea.fill(data.toString());
	}
}
