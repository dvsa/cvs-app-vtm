import { expect } from '@playwright/test';
import type { PageFactory } from '../../page-objects/page.factory';
import type { SearchResultCard } from '../../page-objects/search/search-result.card';

export async function selectSearchResult(pages: PageFactory, card: SearchResultCard): Promise<void> {
	const vin = (await card.vin.innerText()).trim();
	const isTrailer = (await card.trailerId.count()) === 1;
	const identifier = (await (isTrailer ? card.trailerId : card.vrm).innerText()).replace(/\s/g, '');
	const href = await card.selectLink.getAttribute('href');
	if (!href) throw new Error('Search result must have a link to its technical record.');
	const recordURL = new URL(href, pages.page.url()).href;

	await card.selectLink.click();
	await expect(pages.page).toHaveURL(recordURL);
	const view = pages.viewTechnicalRecordPage;
	await expect(view.heading).toBeVisible();
	await expect(view.vin).toHaveText(vin);
	await expect(isTrailer ? view.trailerId : view.vrm).toHaveText(
		new RegExp(`^\\s*${identifier.split('').join('\\s*')}\\s*$`)
	);
}
