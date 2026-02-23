import { test } from '@playwright/test';

test.describe.skip('Create CAR records', () => {
	test('should create a skeleton CAR record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a skeleton CAR record',
		});
	});

	test('should create a testable CAR record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a testable CAR record',
		});
	});

	test('should create a complete CAR record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a complete CAR record',
		});
	});
});
