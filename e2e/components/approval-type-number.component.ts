import type { Locator, Page } from '@playwright/test';

export class ApprovalTypeNumber {
	readonly locator: Locator;

	constructor(scope: Page | Locator) {
		this.locator = scope.locator('approval-type-number-input');
	}

	async fill(value: string): Promise<void> {
		const parts = /^e(\d+)\*(\d+)\/(\d+)\*(\d+)$/i.exec(value)?.slice(1) ?? [value];
		const inputs = this.locator.locator('input');
		await inputs.first().waitFor({ state: 'visible' });
		if ((await inputs.count()) !== parts.length) throw new Error(`Unsupported approval number format "${value}".`);
		for (const [index, part] of parts.entries()) await inputs.nth(index).fill(part);
	}
}
