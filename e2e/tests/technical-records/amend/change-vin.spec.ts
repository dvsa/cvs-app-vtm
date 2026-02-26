import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Change VIN', { tag: ['@tech-record', '@amend-tech-record'] }, () => {
	test('should change the VIN of a record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should change the VIN of a record',
		});
	});
});
