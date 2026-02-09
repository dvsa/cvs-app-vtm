import { Locator } from '@playwright/test';
import { BaseComponent } from './base.component';
import { RadiosComponent } from './radios.component';

export class RadioComponent extends BaseComponent {
	readonly value: string;
	readonly label: Locator;
	readonly radio: Locator;

	constructor(parent: RadiosComponent, value: string) {
		super(parent.page, parent.id);
		this.value = value;
		this.label = this.page.locator(`//*[@id="${this.id}-${this.value}-label"]`);
		this.radio = this.page.locator(`//*[@id="${this.id}-${this.value}-radio"]`);
	}
}
