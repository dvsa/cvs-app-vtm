import { test } from '@/e2e/fixtures/global.fixture';
import { SKELETON_HGV_1 } from '@/e2e/mocks/tech-records/hgv/skeleton-hgvs.mock';
import { COMPLETE_LGV_1 } from '@/e2e/mocks/tech-records/lgv/complete-lgvs.mock';
import { SKELETON_LGV_1 } from '@/e2e/mocks/tech-records/lgv/skeleton-lgvs.mock';
import { NewRecordDetailsPage } from '@/e2e/pages/create/new-record-details.page';
import { ViewTechRecordPage } from '@/e2e/pages/tech-records/view-tech-record.page';

test.describe.skip('Create LGV records', { tag: ['@tech-record', '@create-tech-record', '@lgv'] }, () => {
	test('should create a skeleton LGV record', async ({ page, createPage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a skeleton LGV record',
		});

		// Record details
		await createPage.fill(SKELETON_LGV_1);
		await createPage.submit();

		// Create new record details
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.loaded();
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(SKELETON_HGV_1);
		await recordDetailsPage.submit();

		// Assert view fields are expected
		const viewTechRecordPage = new ViewTechRecordPage(page);
		await viewTechRecordPage.loaded();
	});

	test('should create a complete LGV record', async ({ page, createPage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a complete LGV record',
		});

		// Record details
		await createPage.fill(COMPLETE_LGV_1);
		await createPage.submit();

		// Create new record details
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.loaded();
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(COMPLETE_LGV_1);
		await recordDetailsPage.submit();

		// Assert view fields are expected
		const viewTechRecordPage = new ViewTechRecordPage(page);
		await viewTechRecordPage.loaded();
	});
});
