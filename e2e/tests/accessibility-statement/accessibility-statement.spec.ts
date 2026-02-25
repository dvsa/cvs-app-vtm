import { test } from '@/e2e/fixtures/global.fixture';
import { AccessibilityStatementPage } from '@/e2e/pages/accessibility-statement/accessibility-statement.page';

test.describe.skip('Accessibility statement', () => {
	test('should display the accessibility statement', async ({ page, homePage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should display the accessibility statement',
		});
		await homePage.footer.accessibilityStatementLink.click();
		const accessibilityStatementPage = new AccessibilityStatementPage(page);
		await accessibilityStatementPage.loaded();
	});
});
