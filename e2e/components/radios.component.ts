import { BaseComponent } from './base.component';

export class Radios extends BaseComponent {
	readonly value = (): Promise<string | null> =>
		this.locator.evaluate((group) => {
			const selected = group.querySelector<HTMLInputElement>('input[type="radio"]:checked');
			if (!selected) return null;
			// Read-only radios can expose "on"; their label reference retains the domain value.
			const label = selected.getAttribute('aria-labelledby');
			const prefix = `${group.id}-`;
			if (label?.startsWith(prefix) && label.endsWith('-label')) {
				return label.slice(prefix.length, -'-label'.length);
			}
			if (!selected.hasAttribute('value')) throw new Error('Selected radio has no domain value or label reference.');
			return selected.value;
		});

	async fill(value: string | number | boolean): Promise<void> {
		const id = await this.locator.getAttribute('id');
		await this.locator
			.locator(
				`input[type="radio"]:is([value=${JSON.stringify(String(value))}], [id=${JSON.stringify(`${id}-${value}-radio`)}])`
			)
			.check();
	}
}
