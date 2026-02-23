import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home/home.page';

export type GlobalFixtures = {
	homePage: HomePage;
};

export const test = base.extend<GlobalFixtures>({
	homePage: async ({ page }, use) => {
		const homePage = new HomePage(page);
		await homePage.goto();
		await homePage.loaded();
		use(homePage);
	},
});

export * from '@playwright/test';
