import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Edit a TRL reason for abandoning', { tag: ['@reference-data'] }, () => {
	test('A brake code can be amended in the brake codes reference data table', async ({ page }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should be able to edit a TRL reason for abandoning',
		});

		// check that we can then abandon a TRL test with this new reason
	});
});
