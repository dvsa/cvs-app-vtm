import { expect, test } from '@playwright/test';
import { CreatePage } from '../pages/create/create.page';
import { DuplicateVinPage } from '../pages/duplicate-vin/duplicate-vin.page';
import { HomePage } from '../pages/home/home.page';
import { SearchResultsPage } from '../pages/search-results/search-results.page';
import { SearchPage } from '../pages/search/search.page';

test.describe('Accessibility', () => {
	test('tech record journey', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should go through each step of the tech record journey and scan the page for accessibility issues',
		});

		// Go to home page -> search for a technical record
		await page.goto('/');
		await expect(await page.title()).toBe('Vehicle Testing Management - Home');
		const homePage = new HomePage(page);
		await homePage.searchTechRecordLink.click();

		// Search for a technical record -> search results page
		await page.waitForURL(/\/search/);
		await expect(await page.title()).toBe('Vehicle Testing Management - Technical record search');
		const searchPage = new SearchPage(page);
		await searchPage.searchInput.fill('VTM-123456789');
		await searchPage.searchCriteria.selectOption({ label: 'Vehicle registration mark (VRM)' });
		await searchPage.searchButton.click();

		// Search results (with non-existant VRM) -> check error summary
		await page.waitForURL(/\/search\/results/);
		await expect(await page.title()).toBe('Vehicle Testing Management - Search Results');
		const searchResultsPage = new SearchResultsPage(page);
		await expect(await searchResultsPage.errorSummary.textContent()).toContain(
			'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number'
		);
		await expect(searchResultsPage.createNewTechRecordLink).toBeVisible();
		await searchResultsPage.createNewTechRecordLink.click();

		// Create new technical record -> enter duplicate VRM
		await page.waitForURL(/\/create/);
		await expect(await page.title()).toBe('Vehicle Testing Management - Create new technical record');
		const createPage = new CreatePage(page);
		await createPage.vin.input.fill('HGVTST5');
		await createPage.generateCTZNumber.checkbox.check();
		await createPage.vehicleStatus.selectOption('current');
		await createPage.vehicleType.selectOption('hgv');
		await createPage.continueButton.click();

		// Duplicate VRM -> create new record details
		await page.waitForURL(/\/create\/duplicate-vin/);
		await expect(await page.title()).toBe('Vehicle Testing Management - Create new technical record');
		const duplicateVinPage = new DuplicateVinPage(page);
		await duplicateVinPage.confirmButton.click();
	});
});
