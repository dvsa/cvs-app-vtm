import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Amend MOTORCYCLE records', { tag: ['@tech-record', '@amend-tech-record', '@motorcycle'] }, () => {
	test('should amend a skeleton MOTORCYCLE record to make it complete', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should amend a skeleton MOTORCYCLE record to make it complete',
		});
	});
});
