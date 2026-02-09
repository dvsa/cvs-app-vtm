import { BaseComponent } from './base.component';

export class TextInputComponent extends BaseComponent {
	readonly hint = this.page.locator(`//*[@id="${this.id}-hint"]`);
	readonly label = this.page.locator(`//*[@id="${this.id}-label"]`);
	readonly input = this.page.locator(`//*[@id="${this.id}"]`);
	readonly inlineError = this.page.locator(`//*[@id="${this.id}-error"]`);
	readonly globalError = this.page.locator(`//*[@id="${this.id}-global-error"]`);
}
