import { Locator, Page, expect } from '@playwright/test';
import { BaseComponent } from './base.component';

export class Select extends BaseComponent {
	readonly value = async (): Promise<string> => {
		// Angular ngValue prefixes primitive option values with an index.
		return (await this.locator.inputValue()).replace(/^\d+: /, '');
	};

	constructor(scope: Page | Locator, id: string) {
		super(scope, id, 'select');
	}

	async fill(value: string | number | boolean): Promise<void> {
		const rawValue = String(value);
		let selected: string | undefined;
		await expect
			.poll(
				async () => {
					const options = await this.locator.locator('option').evaluateAll((elements) =>
						elements.map((element) => {
							if (!(element instanceof HTMLOptionElement)) throw new Error('Expected a select option.');
							return element.value;
						})
					);
					// Angular ngValue prefixes primitive option values with an index.
					const matches = options.filter((option) => option === rawValue || option.replace(/^\d+: /, '') === rawValue);
					selected = matches.length === 1 ? matches[0] : undefined;
					return matches.length;
				},
				{ message: `Expected one select option for "${rawValue}".` }
			)
			.toBe(1);
		if (selected === undefined) throw new Error(`Missing option value for "${rawValue}".`);
		await this.locator.selectOption(selected);
	}
}
