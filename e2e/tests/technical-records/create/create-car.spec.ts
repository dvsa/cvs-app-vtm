import { test } from '@/e2e/fixtures/global.fixture';
import { COMPLETE_CAR_1 } from '@/e2e/mocks/tech-records/car/complete-cars.mock';
import { SKELETON_CAR_1 } from '@/e2e/mocks/tech-records/car/skeleton-cars.mock';
import { NewRecordDetailsPage } from '@/e2e/pages/create/new-record-details.page';
import { ViewTechRecordPage } from '@/e2e/pages/tech-records/view-tech-record.page';

test.describe('Create CAR records', { tag: ['@tech-record', '@create-tech-record', '@car'] }, () => {
	test('should create a skeleton CAR record', async ({ page, createPage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a skeleton CAR record',
		});

		// Record details
		await createPage.fill(SKELETON_CAR_1);
		await createPage.submit();

		// Create new record details
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.loaded();
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(SKELETON_CAR_1);
		await recordDetailsPage.submit();

		// Assert view fields are expected
		const viewTechRecordPage = new ViewTechRecordPage(page);
		await viewTechRecordPage.loaded();
	});

	test('should create a complete CAR record', async ({ page, createPage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a complete CAR record',
		});

		// Record details
		await createPage.fill(COMPLETE_CAR_1);
		await createPage.submit();

		// Create new record details
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.loaded();
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(COMPLETE_CAR_1);
		await recordDetailsPage.submit();

		// Assert view fields are expected
		const viewTechRecordPage = new ViewTechRecordPage(page);
		await viewTechRecordPage.loaded();
	});
});
