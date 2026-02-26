import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Amend SMALL TRL records', { tag: ['@tech-record', '@amend-tech-record', '@small-trl'] }, () => {
	test('should amend a skeleton SMALL TRL record to make it testable', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should amend a skeleton SMALL TRL record to make it testable',
		});
	});

	test('should amend a testable SMALL TRL record to make it complete', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should amend a testable SMALL TRL record to make it complete',
		});
	});
});
