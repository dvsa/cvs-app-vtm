import { test } from '@/e2e/fixtures/global.fixture';
import { COMPLETE_TRL_1 } from '@/e2e/mocks/tech-records/trl/complete-trls.mock';
import { SKELETON_TRL_1 } from '@/e2e/mocks/tech-records/trl/skeleton-trls.mock';
import { TESTABLE_TRL_1 } from '@/e2e/mocks/tech-records/trl/testable-trls.mock';
import { NewRecordDetailsPage } from '@/e2e/pages/create/new-record-details.page';
import { ViewTechRecordPage } from '@/e2e/pages/tech-records/view-tech-record.page';

test.describe('Create TRL records', { tag: ['@tech-record', '@create-tech-record', '@trl'] }, () => {
	test('should create a skeleton TRL record', async ({ page, createPage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a skeleton TRL record',
		});

		// Record details
		await createPage.fill(SKELETON_TRL_1);
		await createPage.submit();

		// Create new record details
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.loaded();
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(SKELETON_TRL_1);
		await recordDetailsPage.submit();

		// Assert view fields are expected
		const viewTechRecordPage = new ViewTechRecordPage(page);
		await viewTechRecordPage.loaded();
	});

	test('should create a testable TRL record', async ({ page, createPage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a testable TRL record',
		});

		// Record details
		await createPage.fill(TESTABLE_TRL_1);
		await createPage.submit();

		// Create new record details
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.loaded();
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(TESTABLE_TRL_1);
		await recordDetailsPage.submit();

		// Assert view fields are expected
		const viewTechRecordPage = new ViewTechRecordPage(page);
		await viewTechRecordPage.loaded();
	});

	test('should create a complete TRL record', async ({ page, createPage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a complete TRL record',
		});

		// Record details
		await createPage.fill(COMPLETE_TRL_1);
		await createPage.submit();

		// Create new record details
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.loaded();
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(COMPLETE_TRL_1);
		await recordDetailsPage.submit();

		// Assert view fields are expected
		const viewTechRecordPage = new ViewTechRecordPage(page);
		await viewTechRecordPage.loaded();
	});
});
