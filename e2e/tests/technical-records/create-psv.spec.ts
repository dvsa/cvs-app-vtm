import { test } from '@playwright/test';

test.describe.skip('Create PSV records', () => {
	test('should create a skeleton PSV record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a skeleton PSV record',
		});
	});

	test('should create a testable PSV record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a testable PSV record',
		});
	});

	test('should create a complete PSV record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a complete PSV record',
		});
	});
});
