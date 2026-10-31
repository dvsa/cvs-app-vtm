import { expect } from '@playwright/test';
import { BaseComponent } from './base.component';

export class CheckboxGroup extends BaseComponent {
	async fill(values: (string | number)[]): Promise<void> {
		const checkboxes = this.locator.locator('input[type="checkbox"]');
		await expect(checkboxes.first()).toBeVisible();
		const id = await this.locator.getAttribute('id');
		const selectedIds = values.map((value) => `${id}-${value}-checkbox`);
		for (const selectedId of selectedIds) {
			await expect(this.locator.locator(`[id=${JSON.stringify(selectedId)}]`)).toBeVisible();
		}
		for (const checkbox of await checkboxes.all()) {
			const checkboxId = await checkbox.getAttribute('id');
			await checkbox.setChecked(checkboxId !== null && selectedIds.includes(checkboxId));
		}
	}
}
