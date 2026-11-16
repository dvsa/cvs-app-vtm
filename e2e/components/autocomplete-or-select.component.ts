import { Locator, Page } from '@playwright/test';
import { Autocomplete } from './autocomplete.component';
import { InputOrSelect } from './input-or-select.component';

export class AutocompleteOrSelect extends InputOrSelect {
	private readonly autocomplete: Autocomplete;

	constructor(scope: Page | Locator, id: string) {
		super(scope, id);
		this.autocomplete = new Autocomplete(scope, id);
	}

	override async fill(value: string | number): Promise<void> {
		if ((await this.locator.evaluate((element) => element.tagName)) === 'SELECT') {
			await super.fill(value);
		} else {
			await this.autocomplete.fill(String(value));
		}
	}
}
