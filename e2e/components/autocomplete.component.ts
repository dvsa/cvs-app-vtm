import { BaseComponent } from './base.component';

export class Autocomplete extends BaseComponent {
	readonly value = (): Promise<string> => this.locator.inputValue();

	async fill(value: string): Promise<void> {
		await this.locator.fill(value);
		await this.locator.locator('..').getByRole('option', { name: value, exact: true }).click();
	}
}
