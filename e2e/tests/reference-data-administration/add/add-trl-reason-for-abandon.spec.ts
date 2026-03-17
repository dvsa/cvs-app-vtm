import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Add a TRL reason for abandoning', { tag: ['@reference-data'] }, () => {
	test('A brake code can be inserted into the brake codes reference data table', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should be able to add a a TRL reason for abandoning',
		});

		// check that we can then abandon a TRL test with this new reason
	});
});
