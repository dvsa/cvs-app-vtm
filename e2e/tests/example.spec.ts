import { expect, test } from '@playwright/test';
import { TESTABLE_HGV_1 } from '../mocks/hgv/testable-hgvs.mock';
import { BetasPage } from '../pages/betas/betas.page';
import { CreatePage } from '../pages/create/create.page';
import { DuplicateVinPage } from '../pages/create/duplicate-vin.page';
import { NewRecordDetailsPage } from '../pages/create/new-record-details.page';
import { HomePage } from '../pages/home/home.page';
import { SearchResultsPage } from '../pages/search/search-results/search-results.page';
import { SearchPage } from '../pages/search/search.page';

test.describe.skip('Accessibility', () => {
	test('tech record journey', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should go through each step of the tech record journey and scan the page for accessibility issues',
		});

		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.waitForLoadState('domcontentloaded');
		await expect(await page.title()).toBe('Vehicle Testing Management - Home');
		const homePage = new HomePage(page);
		await homePage.runAccessibilityScan(testInfo);

		// Go to betas page -> enable techrecord
		await expect(homePage.betasLink).toBeVisible();
		await homePage.betasLink.click();
		await page.waitForURL(/\/betas/);
		await expect(await page.title()).toBe('Vehicle Testing Management - Betas');
		const betasPage = new BetasPage(page);
		await betasPage.runAccessibilityScan(testInfo);
		await betasPage.techRecordRedesignCheckbox.checkbox.check();
		await betasPage.savePreferencesButton.click();

		// Go to home page -> search for a technical record
		await homePage.searchTechRecordLink.click();

		// Search for a technical record -> search results page
		await page.waitForURL(/\/search/);
		await expect(await page.title()).toBe('Vehicle Testing Management - Technical record search');
		const searchPage = new SearchPage(page);
		await searchPage.runAccessibilityScan(testInfo);
		await searchPage.searchInput.fill('VTM-123456789');
		await searchPage.searchCriteria.selectOption({
			label: 'Vehicle registration mark (VRM)',
		});
		await searchPage.searchButton.click();

		// Search results (with non-existant VRM) -> check error summary
		await page.waitForURL(/\/search\/results/);
		await expect(await page.title()).toBe('Vehicle Testing Management - Search Results');
		const searchResultsPage = new SearchResultsPage(page);
		await searchResultsPage.runAccessibilityScan(testInfo);
		await expect(await searchResultsPage.errorSummary.textContent()).toContain(
			'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number'
		);
		await expect(searchResultsPage.createNewTechRecordLink).toBeVisible();
		await searchResultsPage.createNewTechRecordLink.click();

		// Create new technical record -> enter duplicate VRM
		await page.waitForURL(/\/create/);
		await expect(await page.title()).toBe('Vehicle Testing Management - Create new technical record');
		const createPage = new CreatePage(page);
		await createPage.runAccessibilityScan(testInfo);
		await createPage.vin.input.fill('HGVTST5');
		await createPage.generateCTZNumber.checkbox.check();
		await createPage.vehicleStatus.selectOption('current');
		await createPage.vehicleType.selectOption('hgv');
		await createPage.continueButton.click();

		// Duplicate VRM -> create new record details
		await page.waitForURL(/\/create\/duplicate-vin/);
		await expect(await page.title()).toBe('Vehicle Testing Management - Create new technical record');
		const duplicateVinPage = new DuplicateVinPage(page);
		await duplicateVinPage.runAccessibilityScan(testInfo);
		await duplicateVinPage.confirmButton.click();

		// Create new record details
		await page.waitForURL(/\/create\/new-record-details/);
		await expect(await page.title()).toBe('Vehicle Testing Management - New record details');
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.runAccessibilityScan(testInfo);
		await recordDetailsPage.fill(TESTABLE_HGV_1);
		await recordDetailsPage.submit();

		// View record details
		await page.waitForURL(/\/tech-records/);
		await expect(await page.title()).toBe('Vehicle Testing Management - View technical record');
	});
});
