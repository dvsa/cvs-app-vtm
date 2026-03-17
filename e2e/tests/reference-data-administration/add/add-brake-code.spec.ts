import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Add brake code reference data item', { tag: ['@reference-data'] }, () => {
	test('A brake code can be inserted into the brake codes reference data table', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should be able to add a brake code reference data item',
		});

		// check that we can then use this brake code in the creation/amendment of a PSV technical record
	});
});
