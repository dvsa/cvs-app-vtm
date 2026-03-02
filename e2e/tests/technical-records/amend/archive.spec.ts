import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Archive', { tag: ['@tech-record', '@archive'] }, () => {
	test('Archive a current record', ({ page }, testInfo) => {
		testInfo.tags.push('@current');
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Archive a current record',
		});
	});

	test('Archive a provisional record', ({ page }, testInfo) => {
		testInfo.tags.push('@provisional');
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Archive a provisional record',
		});
	});
});
