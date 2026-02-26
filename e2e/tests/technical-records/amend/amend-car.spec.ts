import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Amend CAR records', { tag: ['@tech-record', '@amend-tech-record', '@car'] }, () => {
	test('should amend a skeleton CAR record to make it complete', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should amend a skeleton CAR record to make it complete',
		});
	});
});
