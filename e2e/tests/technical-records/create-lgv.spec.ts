import { test } from '@playwright/test';

test.describe.skip('Create LGV records', () => {
	test('should create a skeleton LGV record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a skeleton LGV record',
		});
	});

	test('should create a testable LGV record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a testable LGV record',
		});
	});

	test('should create a complete LGV record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a complete LGV record',
		});
	});
});
