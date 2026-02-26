import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Amend HGV records', { tag: ['@tech-record', '@amend-tech-record', '@hgv'] }, () => {
	test('should amend a skeleton HGV record to make it testable', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should amend a skeleton HGV record to make it testable',
		});
	});

	test('should amend a testable HGV record to make it complete', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should amend a testable HGV record to make it complete',
		});
	});
});
