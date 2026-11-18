import { randomInt } from 'node:crypto';
import type { SearchCriteria, TechnicalRecordsApi } from '../../api/technical-records.api';
import { CarBuilder } from '../../builders/vehicle/car.builder';
import { HgvBuilder } from '../../builders/vehicle/hgv.builder';
import { LgvBuilder } from '../../builders/vehicle/lgv.builder';
import { PsvBuilder } from '../../builders/vehicle/psv.builder';
import { TrlBuilder } from '../../builders/vehicle/trl.builder';
import { generateVin } from '../../builders/vehicle/vehicle.builder';
import { expect, test } from '../../fixtures/api.fixture';
import { PageFactory } from '../../page-objects/page.factory';
import type { TechnicalRecord } from '../../page-objects/technical-record/technical-record.page';
import {
	searchTechnicalRecords,
	submitTechnicalRecordSearch,
} from '../../workflows/search/search-technical-records.workflow';
import { selectSearchResult } from '../../workflows/search/select-search-result.workflow';

async function unusedSearchTerm(api: TechnicalRecordsApi, criteria: SearchCriteria = 'all'): Promise<string> {
	const characters = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
	for (let attempt = 0; attempt < 5; attempt++) {
		const term = Array.from({ length: criteria === 'partialVin' ? 6 : 8 }, () =>
			characters.charAt(randomInt(characters.length))
		).join('');
		if ((await api.search(criteria, term)).length === 0) return term;
	}
	throw new Error('Unable to allocate an unused search term in the shared test environment.');
}

async function expectResults(pages: PageFactory, records: TechnicalRecord[]): Promise<void> {
	const search = pages.searchTechRecordPage;
	await expect(search.results).toHaveCount(records.length);
	await expect
		.poll(async () => (await search.resultVins.allTextContents()).map((vin) => vin.trim()).sort())
		.toEqual(records.map((record) => record.vin).sort());
	await expect(search.resultCount).toHaveText(
		`Showing ${records.length} result${records.length === 1 ? '' : 's'} of ${records.length}`
	);
	await expect(search.noRecordsHeading).toBeHidden();
	await expect(search.errors).toBeHidden();
}

test.describe('Technical record search', { tag: ['@regression', '@technical-record', '@search'] }, () => {
	test('searches all criteria and returns matching VIN, VRM and trailer ID records', async ({
		page,
		technicalRecordsApi,
	}) => {
		const term = await unusedSearchTerm(technicalRecordsApi);
		const records = [
			new HgvBuilder().current().skeleton().withVrm().build({ vin: term }),
			new PsvBuilder().provisional().skeleton().withVrm(term).build(),
			new TrlBuilder().current().skeleton().withTrailerId(term).build(),
		];
		await Promise.all(records.map((record) => technicalRecordsApi.create(record)));
		const pages = new PageFactory(page);
		await searchTechnicalRecords(pages, { term, criteria: 'all' });
		await expectResults(pages, records);
		await selectSearchResult(pages, pages.searchTechRecordPage.result(0));
	});

	test('filters by full VIN without returning a record whose VRM matches the same term', async ({
		page,
		technicalRecordsApi,
	}) => {
		const term = await unusedSearchTerm(technicalRecordsApi);
		const record = new LgvBuilder().current().skeleton().withVrm().build({ vin: term });
		const other = new CarBuilder().current().skeleton().withVrm(term).build();
		await Promise.all([technicalRecordsApi.create(record), technicalRecordsApi.create(other)]);
		const pages = new PageFactory(page);
		await searchTechnicalRecords(pages, { term, criteria: 'vin' });
		await expectResults(pages, [record]);
		await selectSearchResult(pages, pages.searchTechRecordPage.result(0));
	});

	test('filters by partial VIN and returns both matching suffixes without matching a VRM', async ({
		page,
		technicalRecordsApi,
	}) => {
		const term = await unusedSearchTerm(technicalRecordsApi, 'partialVin');
		const records = [
			new HgvBuilder().current().skeleton().withVrm().withPartialVin(term).build(),
			new PsvBuilder().provisional().skeleton().withVrm().withPartialVin(term).build(),
		];
		const other = new CarBuilder().current().skeleton().withVrm(term).build();
		await Promise.all([...records, other].map((record) => technicalRecordsApi.create(record)));
		const pages = new PageFactory(page);
		await searchTechnicalRecords(pages, { term, criteria: 'partialVin' });
		await expectResults(pages, records);
		await selectSearchResult(pages, pages.searchTechRecordPage.result(1));
	});

	test('filters by VRM with lowercase input without returning a record whose VIN matches', async ({
		page,
		technicalRecordsApi,
	}) => {
		const term = await unusedSearchTerm(technicalRecordsApi);
		const record = new PsvBuilder().current().skeleton().withVrm(term).build();
		const other = new HgvBuilder().provisional().skeleton().withVrm().build({ vin: term });
		await Promise.all([technicalRecordsApi.create(record), technicalRecordsApi.create(other)]);
		const pages = new PageFactory(page);
		await searchTechnicalRecords(pages, { term: term.toLowerCase(), criteria: 'primaryVrm' });
		await expect(pages.searchTechRecordPage.term.locator).toHaveValue(term);
		await expectResults(pages, [record]);
		await selectSearchResult(pages, pages.searchTechRecordPage.result(0));
	});

	test('filters by trailer ID without returning a record whose VIN matches the same term', async ({
		page,
		technicalRecordsApi,
	}) => {
		const term = await unusedSearchTerm(technicalRecordsApi);
		const record = new TrlBuilder().provisional().skeleton().withTrailerId(term).build();
		const other = new LgvBuilder().current().skeleton().withVrm().build({ vin: term });
		await Promise.all([technicalRecordsApi.create(record), technicalRecordsApi.create(other)]);
		const pages = new PageFactory(page);
		await searchTechnicalRecords(pages, { term, criteria: 'trailerId' });
		await expectResults(pages, [record]);
		await selectSearchResult(pages, pages.searchTechRecordPage.result(0));
	});

	test('includes five archived matches and paginates from four results to the remaining record', async ({
		page,
		technicalRecordsApi,
	}) => {
		const term = await unusedSearchTerm(technicalRecordsApi, 'partialVin');
		const records = Array.from({ length: 5 }, () =>
			new HgvBuilder().current().skeleton().withVrm().withPartialVin(term).build()
		);
		await Promise.all(
			records.map(async (record) => {
				const created = await technicalRecordsApi.create(record);
				await technicalRecordsApi.archive(created, 'Archived search pagination prerequisite');
			})
		);
		await expect
			.poll(async () =>
				(await technicalRecordsApi.search('partialVin', term)).map((record) => record.techRecord_statusCode)
			)
			.toEqual(Array(5).fill('archived'));

		const pages = new PageFactory(page);
		await searchTechnicalRecords(pages, { term, criteria: 'partialVin' });
		const search = pages.searchTechRecordPage;
		await expect(search.noRecordsHeading).toBeVisible();
		await expect(search.results).toHaveCount(0);
		await expect(search.archivedRecordsLink.locator).toBeVisible();

		await search.openFilters();
		await expect(search.includeArchived.locator).not.toBeChecked();
		await search.includeArchived.fill(true);
		await submitTechnicalRecordSearch(pages, { term, criteria: 'partialVin', includeArchived: true }, true);
		await expect(search.results).toHaveCount(4);
		await expect(search.resultCount).toHaveText('Showing 4 results of 5');
		await expect(search.results.locator('app-tag')).toHaveText(Array(4).fill('ARCHIVED'));
		const firstPageVins = (await search.resultVins.allTextContents()).map((vin) => vin.trim());
		await search.nextPage.click();

		await expect(page).toHaveURL(
			(url) =>
				url.searchParams.get('search-results-page') === '2' &&
				url.searchParams.get('includeArchived') === 'true' &&
				url.searchParams.get('searchCriteria') === 'partialVin' &&
				url.searchParams.get('searchTerm') === term
		);
		await expect(search.results).toHaveCount(1);
		await expect(search.resultCount).toHaveText('Showing 1 result of 5');
		await expect(search.results.locator('app-tag')).toHaveText('ARCHIVED');
		await expect(search.includeArchived.locator).toBeChecked();
		await expect(search.previousPage.locator).toBeVisible();
		await expect(search.nextPage.locator).toBeHidden();
		const secondPageVins = (await search.resultVins.allTextContents()).map((vin) => vin.trim());
		expect([...firstPageVins, ...secondPageVins].sort()).toEqual(records.map((record) => record.vin).sort());
		await selectSearchResult(pages, search.result(0));
	});

	test('shows no results for an unknown valid VIN and opens the create-new-record page', async ({ page }) => {
		const pages = new PageFactory(page);
		await searchTechnicalRecords(pages, { term: generateVin(), criteria: 'vin' });
		const search = pages.searchTechRecordPage;
		await expect(search.noRecordsHeading).toBeVisible();
		await expect(search.results).toHaveCount(0);
		await expect(search.errors).toBeHidden();
		await expect(search.archivedRecordsLink.locator).toBeHidden();
		await expect(search.pagination).toBeHidden();
		await expect(search.createNewTechRecordLink.locator).toBeVisible();
		await search.createNewTechRecordLink.click();
		await expect(page).toHaveURL(/\/create$/);
		await expect(pages.createTechnicalRecordPage.heading).toBeVisible();
	});

	test('shows inline and global validation errors for an empty search without showing no-results content', async ({
		page,
	}) => {
		const pages = new PageFactory(page);
		await page.goto('/search');
		const search = pages.searchTechRecordPage;
		await expect(search.heading).toBeVisible();
		await search.searchButton.click();
		const error = 'You must provide a vehicle registration mark, trailer ID or vehicle identification number.';
		await expect(search.globalSearchError).toHaveText(error);
		await expect(search.inlineSearchError).toHaveText(`Error: ${error}`);
		await expect(search.noRecordsHeading).toBeHidden();
		await expect(search.createNewTechRecordLink.locator).toBeHidden();
		await expect(page).toHaveURL(/\/search$/);
	});
});
