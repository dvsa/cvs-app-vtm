import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Delete brake code reference data item', { tag: ['@reference-data'] }, () => {
	test('A brake code can be deleted from the brake codes reference data table', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should be able to delete a brake code reference data item',
		});

		// check that the item exists in the 'delete items' table
		// check that the item can no longer be selected during PSV technical record creation
	});
});
