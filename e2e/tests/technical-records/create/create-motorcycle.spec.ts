import { test } from '@/e2e/fixtures/global.fixture';
import { COMPLETE_MOTORCYCLE_1 } from '@/e2e/mocks/tech-records/motorcycle/complete-motorcycles.mock';
import { SKELETON_MOTORCYCLE_1 } from '@/e2e/mocks/tech-records/motorcycle/skeleton-motorcycles.mock';
import { NewRecordDetailsPage } from '@/e2e/pages/create/new-record-details.page';
import { ViewTechRecordPage } from '@/e2e/pages/tech-records/view-tech-record.page';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';

test.describe('Create MOTORCYCLE records', { tag: ['@tech-record', '@create-tech-record', '@motorcycle'] }, () => {
	test('should create a skeleton MOTORCYCLE record', async ({ page, createPage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a skeleton MOTORCYCLE record',
		});

		// Record details
		await createPage.fill(SKELETON_MOTORCYCLE_1 as TechRecordType<'put'>);
		await createPage.submit();

		// Create new record details
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.loaded();
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(SKELETON_MOTORCYCLE_1 as TechRecordType<'put'>);
		await recordDetailsPage.submit();

		// Assert view fields are expected
		const viewTechRecordPage = new ViewTechRecordPage(page);
		await viewTechRecordPage.loaded();
	});

	test('should create a complete MOTORCYCLE record', async ({ page, createPage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a complete MOTORCYCLE record',
		});

		// Record details
		await createPage.fill(COMPLETE_MOTORCYCLE_1);
		await createPage.submit();

		// Create new record details
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.loaded();
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(COMPLETE_MOTORCYCLE_1);
		await recordDetailsPage.submit();

		// Assert view fields are expected
		const viewTechRecordPage = new ViewTechRecordPage(page);
		await viewTechRecordPage.loaded();
	});
});
