import { test } from '@playwright/test';

test.describe.skip('Create TRL records', () => {
	test('should create a skeleton TRL record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a skeleton TRL record',
		});
	});

	test('should create a testable TRL record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a testable TRL record',
		});
	});

	test('should create a complete TRL record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a complete TRL record',
		});
	});
});
