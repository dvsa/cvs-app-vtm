import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Create ADR test results', { tag: ['@contingency-test', '@adr'] }, () => {
	// ADR PASS
	test.describe('Create ADR PASS results', { tag: ['@pass'] }, () => {
		test('should create an ADR PASS free retest on a HGV which has been approved to carry dangerous goods', async ({
			page,
		}, testInfo) => {
			testInfo.annotations.push({
				type: 'BDD',
				description: 'Should create an ADR PASS free retest on a HGV which has been approved to carry dangerous goods',
			});

			// check certificate can be issued mid-test
		});

		test('should create an ADR paid retest PASS on a HGV which has been approved to carry dangerous goods', async ({
			page,
		}, testInfo) => {
			testInfo.annotations.push({
				type: 'BDD',
				description: 'Should create an ADR paid retest PASS on a HGV which has been approved to carry dangerous goods',
			});

			// check certificate can be issued via central docs
		});

		test('should create an ADR test PASS on a HGV which has been approved to carry dangerous goods', async ({
			page,
		}, testInfo) => {
			testInfo.annotations.push({
				type: 'BDD',
				description: 'Should create an ADR test PASS on a HGV which has been approved to carry dangerous goods',
			});

			// check certificate can be issued mid-test
		});
	});
	// ADR fail
	test.describe('Create ADR FAIL results', { tag: ['@fail'] }, () => {
		test('should create an ADR FAIL free retest on a HGV which has been approved to carry dangerous goods', async ({
			page,
		}, testInfo) => {
			testInfo.annotations.push({
				type: 'BDD',
				description: 'Should create an ADR FAIL free retest on a HGV which has been approved to carry dangerous goods',
			});
		});

		test('should create an ADR paid retest FAIL on a HGV which has been approved to carry dangerous goods', async ({
			page,
		}, testInfo) => {
			testInfo.annotations.push({
				type: 'BDD',
				description: 'Should create an ADR paid retest FAIL on a HGV which has been approved to carry dangerous goods',
			});
		});

		test('should create an ADR test FAIL on a HGV which has been approved to carry dangerous goods', async ({
			page,
		}, testInfo) => {
			testInfo.annotations.push({
				type: 'BDD',
				description: 'Should create an ADR test FAIL on a HGV which has been approved to carry dangerous goods',
			});
		});
	});
});
