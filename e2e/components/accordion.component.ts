import { expect } from '@playwright/test';
import { Button } from './button.component';

export class Accordion extends Button {
	async open(): Promise<void> {
		await this.setExpanded(true);
	}

	async close(): Promise<void> {
		await this.setExpanded(false);
	}

	async toggle(): Promise<void> {
		await expect(this.locator).toHaveAttribute('aria-expanded', /^(true|false)$/);
		const expanded = (await this.locator.getAttribute('aria-expanded')) === 'true';
		await this.click();
		await expect(this.locator).toHaveAttribute('aria-expanded', String(!expanded));
	}

	private async setExpanded(expanded: boolean): Promise<void> {
		await expect(this.locator).toHaveAttribute('aria-expanded', /^(true|false)$/);
		if ((await this.locator.getAttribute('aria-expanded')) !== String(expanded)) {
			await this.click();
		}
		await expect(this.locator).toHaveAttribute('aria-expanded', String(expanded));
	}
}
