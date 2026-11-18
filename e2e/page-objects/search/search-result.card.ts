import type { Locator } from '@playwright/test';

export class SearchResultCard {
	readonly vin: Locator;
	readonly vrm: Locator;
	readonly trailerId: Locator;
	readonly selectLink: Locator;

	constructor(readonly locator: Locator) {
		this.vin = locator.locator('#test-vin');
		this.vrm = locator.locator('#test-vrm');
		this.trailerId = locator.locator('#test-trailerId');
		this.selectLink = locator.getByRole('link', { name: 'Select', exact: true });
	}
}
