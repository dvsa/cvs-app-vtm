import { test } from '@/e2e/fixtures/global.fixture';
import { COMPLETE_PSV_1 } from '@/e2e/mocks/tech-records/psv/complete-psvs.mock';
import { SKELETON_PSV_1 } from '@/e2e/mocks/tech-records/psv/skeleton-psvs.mock';
import { TESTABLE_PSV_1 } from '@/e2e/mocks/tech-records/psv/testable-psvs.mock';
import { NewRecordDetailsPage } from '@/e2e/pages/create/new-record-details.page';
import { ViewTechRecordPage } from '@/e2e/pages/tech-records/view-tech-record.page';

test.describe('Create PSV records', { tag: ['@tech-record', '@create-tech-record', '@psv'] }, () => {
	test('should create a skeleton PSV record', async ({ page, createPage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a skeleton PSV record',
		});

		// Record details
		await createPage.fill(SKELETON_PSV_1);
		await createPage.submit();

		// Create new record details
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.loaded();
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(SKELETON_PSV_1);
		await recordDetailsPage.submit();

		// Assert view fields are expected
		const viewTechRecordPage = new ViewTechRecordPage(page);
		await viewTechRecordPage.loaded();
	});

	test('should create a testable PSV record', async ({ page, createPage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a testable PSV record',
		});

		// Record details
		await createPage.fill(TESTABLE_PSV_1);
		await createPage.submit();

		// Create new record details
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.loaded();
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(TESTABLE_PSV_1);
		await recordDetailsPage.submit();

		// Assert view fields are expected
		const viewTechRecordPage = new ViewTechRecordPage(page);
		await viewTechRecordPage.loaded();
	});

	test('should create a complete PSV record', async ({ page, createPage }, testInfo) => {
		testInfo.annotations.push({
			type: 'BDD',
			description: 'Should create a complete PSV record',
		});

		// Record details
		await createPage.fill(COMPLETE_PSV_1);
		await createPage.submit();

		// Create new record details
		const recordDetailsPage = new NewRecordDetailsPage(page);
		await recordDetailsPage.loaded();
		await recordDetailsPage.accordions.open();
		await recordDetailsPage.fill(COMPLETE_PSV_1);
		await recordDetailsPage.submit();

		// Assert view fields are expected
		const viewTechRecordPage = new ViewTechRecordPage(page);
		await viewTechRecordPage.loaded();
	});
});
