import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Change VRM', { tag: ['@tech-record', '@amend-tech-record'] }, () => {
	test('should change the VRM of a record', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should change the VRM of a record',
		});
	});

	test('should change the VRMs of two records via cherished transfer', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should change the VRMs of two records via cherished transfer',
		});
	});
});
