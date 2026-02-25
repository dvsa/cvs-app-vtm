import { test as base, expect } from '@playwright/test';
import { BetasPage } from '../pages/betas/betas.page';
import { CreatePage } from '../pages/create/create.page';
import { HomePage } from '../pages/home/home.page';

export type GlobalFixtures = {
	homePage: HomePage;
	createPage: CreatePage;
};

export const test = base.extend<GlobalFixtures>({
	homePage: async ({ page }, use) => {
		const homePage = new HomePage(page);
		await homePage.goto();
		await homePage.loaded();
		use(homePage);
	},
	createPage: async ({ page, homePage }, use) => {
		// Go to betas page -> enable techrecord
		await expect(homePage.betasLink).toBeVisible();
		await homePage.betasLink.click();
		const betasPage = new BetasPage(page);
		await betasPage.loaded();
		await betasPage.techRecordRedesignCheckbox.checkbox.check();
		await betasPage.savePreferencesButton.click();

		// Go to home page -> create new record
		await homePage.createNewTechRecordLink.click();

		// Create new technical record
		const createPage = new CreatePage(page);
		await createPage.loaded();
		use(createPage);
	},
});

export * from '@playwright/test';
