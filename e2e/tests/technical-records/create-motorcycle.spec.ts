import { test } from '@playwright/test';

test.describe.skip('Create MOTORCYCLE records', () => {
	test('should create a skeleton MOTORCYCLE record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a skeleton MOTORCYCLE record',
		});
	});

	test('should create a testable MOTORCYCLE record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a testable MOTORCYCLE record',
		});
	});

	test('should create a complete MOTORCYCLE record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a complete MOTORCYCLE record',
		});
	});
});
