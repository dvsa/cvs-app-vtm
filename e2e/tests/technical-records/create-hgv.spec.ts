import { mockTestableHgvs } from '@/e2e/mocks/hgv/testable-hgvs.mock';
import { BetasPage } from '@/e2e/pages/betas/betas.page';
import { CreatePage } from '@/e2e/pages/create/create.page';
import { NewRecordDetailsPage } from '@/e2e/pages/create/new-record-details/new-record-details.page';
import { HomePage } from '@/e2e/pages/home/home.page';
import { expect, test } from '@playwright/test';

test.describe('Create HGV records', () => {
	test.skip('should create a skeleton HGV record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a skeleton HGV record',
		});
	});

	test('should create a testable HGV record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a testable HGV record',
		});

		// Record details
		const techRecord = mockTestableHgvs[0];

		// Go to home page
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.waitForLoadState('domcontentloaded');
		await expect(await page.title()).toBe('Vehicle Testing Management - Home');
		const homePage = new HomePage(page);

		// Go to betas page -> enable techrecord
		await expect(homePage.betasLink).toBeVisible();
		await homePage.betasLink.click();
		await page.waitForURL(/\/betas/);
		await expect(await page.title()).toBe('Vehicle Testing Management - Betas');
		const betasPage = new BetasPage(page);
		await betasPage.techRecordRedesignCheckbox.checkbox.check();
		await betasPage.savePreferencesButton.click();

		// Go to home page -> create new record
		await homePage.createNewTechRecordLink.click();

		// Create new technical record
		await page.waitForURL(/\/create/);
		await expect(await page.title()).toBe('Vehicle Testing Management - Create new technical record');
		const createPage = new CreatePage(page);
		await createPage.fill(techRecord);
		await createPage.submit();

		// Create new record details
		await page.waitForURL(/\/create\/new-record-details/);
		await expect(await page.title()).toBe('Vehicle Testing Management - New record details');
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(techRecord);
		await recordDetailsPage.submit();

		// View record details
		await page.waitForURL(/\/tech-records/);
		await expect(await page.title()).toBe('Vehicle Testing Management - View technical record');

		// Assert view fields are expected
	});

	test.skip('should create a complete HGV record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a complete HGV record',
		});
	});
});
