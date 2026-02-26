import { test } from '@/e2e/fixtures/global.fixture';
import { COMPLETE_SMALL_TRL_1 } from '@/e2e/mocks/tech-records/small-trl/complete-small-trls.mock';
import { SKELETON_SMALL_TRL_1 } from '@/e2e/mocks/tech-records/small-trl/skeleton-small-trls.mock';
import { TESTABLE_SMALL_TRL_1 } from '@/e2e/mocks/tech-records/small-trl/testable-small-trls.mock';
import { NewRecordDetailsPage } from '@/e2e/pages/create/new-record-details.page';
import { ViewTechRecordPage } from '@/e2e/pages/tech-records/view-tech-record.page';

test.describe('Create SMALL TRL records', { tag: ['@tech-record', '@create-tech-record', '@small-trl'] }, () => {
	test('should create a skeleton SMALL TRL record', async ({ page, createPage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a skeleton SMALL TRL record',
		});

		// Record details
		await createPage.fill(SKELETON_SMALL_TRL_1);
		// @TODO: find a better way to override the trl vehicle type option
		await createPage.vehicleType.fill('small trl');
		await createPage.submit();

		// Create new record details
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.loaded();
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(SKELETON_SMALL_TRL_1);
		await recordDetailsPage.submit();

		// Assert view fields are expected
		const viewTechRecordPage = new ViewTechRecordPage(page);
		await viewTechRecordPage.loaded();
	});

	test('should create a testable SMALL TRL record', async ({ page, createPage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a testable SMALL TRL record',
		});

		// Record details
		await createPage.fill(TESTABLE_SMALL_TRL_1);
		// @TODO: find a better way to override the trl vehicle type option
		await createPage.vehicleType.fill('small trl');
		await createPage.submit();

		// Create new record details
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.loaded();
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(TESTABLE_SMALL_TRL_1);
		await recordDetailsPage.submit();

		// Assert view fields are expected
		const viewTechRecordPage = new ViewTechRecordPage(page);
		await viewTechRecordPage.loaded();
	});

	test('should create a complete SMALL TRL record', async ({ page, createPage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a complete SMALL TRL record',
		});

		// Record details
		await createPage.fill(COMPLETE_SMALL_TRL_1);
		// @TODO: find a better way to override the trl vehicle type option
		await createPage.vehicleType.fill('small trl');
		await createPage.submit();

		// Create new record details
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.loaded();
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(COMPLETE_SMALL_TRL_1);
		await recordDetailsPage.submit();

		// Assert view fields are expected
		const viewTechRecordPage = new ViewTechRecordPage(page);
		await viewTechRecordPage.loaded();
	});
});
