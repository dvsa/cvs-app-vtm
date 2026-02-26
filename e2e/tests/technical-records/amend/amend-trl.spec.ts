import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Amend TRL records', { tag: ['@tech-record', '@amend-tech-record', '@trl'] }, () => {
	test('should amend a skeleton TRL record to make it testable', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should amend a skeleton TRL record to make it testable',
		});
	});

	test('should amend a testable TRL record to make it complete', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should amend a testable TRL record to make it complete',
		});
	});
});
