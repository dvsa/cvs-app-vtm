import { Input } from './input.component';
import { Select } from './select.component';

// These fields render as text inputs or selects depending on the vehicle type.
export class InputOrSelect extends Input {
	override readonly value = async (): Promise<string> => {
		if ((await this.locator.evaluate((element) => element.tagName)) === 'SELECT') {
			const id = await this.locator.getAttribute('id');
			if (id === null) throw new Error('Expected an ID on the select control.');
			return new Select(this.locator.locator('..'), id).value();
		}
		return this.locator.inputValue();
	};

	override async fill(value: string | number): Promise<void> {
		if ((await this.locator.evaluate((element) => element.tagName)) === 'SELECT') {
			const id = await this.locator.getAttribute('id');
			if (id === null) throw new Error('Expected an ID on the select control.');
			await new Select(this.locator.locator('..'), id).fill(String(value));
		} else {
			await super.fill(value);
		}
	}
}
