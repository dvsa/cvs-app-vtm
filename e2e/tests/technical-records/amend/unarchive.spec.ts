import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Unarchive', { tag: ['@tech-record', '@Unarchive'] }, () => {
	test('Unarchive a record with no currents as a current record', ({ page }, testInfo) => {
		testInfo.tags.push('@current');
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Unarchive a record with no currents as a current record',
		});
	});

	test('Unarchive a record with no currents as a provisional record', ({ page }, testInfo) => {
		testInfo.tags.push('@provisional');
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Unarchive a record with no currents as a provisional record',
		});
	});

	test('Unarchive a record with currents as a current record', ({ page }, testInfo) => {
		testInfo.tags.push('@provisional');
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Unarchive a record with currents as a current record',
		});
	});

	test('Unarchive a record with provisionals as a current record', ({ page }, testInfo) => {
		testInfo.tags.push('@provisional');
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Unarchive a record with provisionals as a current record',
		});
	});

	test('Unarchive a record with provisionals as a provisional record', ({ page }, testInfo) => {
		testInfo.tags.push('@provisional');
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Unarchive a record with currents as a provisional record',
		});
	});
});
