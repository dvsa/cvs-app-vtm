import { test } from '@/e2e/fixtures/global.fixture';

test.describe.skip('Promote to current', { tag: ['@tech-record', '@promote'] }, () => {
	test('Promote a provisional record to a current record', ({ page }, testInfo) => {
		testInfo.tags.push('@current');
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Promote a provisional record to a current record',
		});
	});
});
