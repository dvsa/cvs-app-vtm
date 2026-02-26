import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Amend LGV records', { tag: ['@tech-record', '@amend-tech-record', '@lgv'] }, () => {
	test('should amend a skeleton LGV record to make it complete', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should amend a skeleton LGV record to make it complete',
		});
	});
});
