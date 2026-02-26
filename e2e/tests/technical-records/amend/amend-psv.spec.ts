import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Amend PSV records', { tag: ['@tech-record', '@amend-tech-record', '@psv'] }, () => {
	test('should amend a skeleton PSV record to make it testable', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should amend a skeleton PSV record to make it testable',
		});
	});

	test('should amend a testable PSV record to make it complete', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should amend a testable PSV record to make it complete',
		});
	});
});
