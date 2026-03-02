import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Change visibility in VTA', { tag: ['@tech-record', '@amend-tech-record'] }, () => {
	test('should make a hidden record visible in VTA', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should make a hidden record visible in VTA',
		});
	});

	test('should make a visible record hidden in VTA', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should make a visible record hidden in VTA',
		});
	});
});
