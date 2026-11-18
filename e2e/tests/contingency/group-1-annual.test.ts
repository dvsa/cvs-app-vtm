import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import type { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import type { CreatedTechnicalRecord } from '../../api/technical-records.api';
import type { TestResultsApi } from '../../api/test-results.api';
import { PsvAnnualTestBuilder } from '../../builders/psv-annual-test.builder';
import { PsvBuilder } from '../../builders/vehicle/psv.builder';
import { test as apiTest, expect } from '../../fixtures/api.fixture';
import { PageFactory } from '../../page-objects/page.factory';
import { openTechnicalRecord } from '../../workflows/technical-record/open-technical-record.workflow';
import {
	abandonContingencyTest,
	fillContingencyTest,
	startContingencyTest,
	startTestAmendment,
	submitContingencyTest,
	submitTestResult,
	viewContingencyTest,
} from '../../workflows/test-result/contingency-test.workflow';
import { addDefect } from '../../workflows/test-result/defects/add-defect.workflow';

interface AnnualScenario {
	record: CreatedTechnicalRecord;
	builder: PsvAnnualTestBuilder;
}

const test = apiTest.extend<{ annual: AnnualScenario }>({
	annual: async ({ technicalRecordsApi, testResultsApi }, use) => {
		const vehicle = new PsvBuilder().current().testable().withVrm().build();
		const [record, visit] = await Promise.all([technicalRecordsApi.create(vehicle), testResultsApi.getVisit()]);
		await use({ record, builder: new PsvAnnualTestBuilder(vehicle, record, visit) });
	},
});

function displayDate(value: string): string {
	const [year, month, day] = value.slice(0, 10).split('-');
	return `${day}/${month}/${year}`;
}

async function verifyTest(
	pages: PageFactory,
	expected: TestResultSchema,
	reasons: string[],
	status: TestResults | 'cancelled' | null = expected.testTypes[0].testResult
): Promise<void> {
	const view = pages.viewTestResultPage;
	const type = expected.testTypes[0];
	await expect(view.vin).toHaveText(expected.vin);
	await expect(view.vrm).toHaveText(new RegExp(`^\\s*${expected.vrm?.replace(/ /g, '').split('').join('\\s*')}\\s*$`));
	await expect(view.heading).toContainText('Annual test');
	await expect(view.result).toHaveText(new RegExp(`^\\s*${status}\\s*$`, 'i'));
	await expect(view.odometerReading).toHaveText(`${expected.odometerReading?.toLocaleString('en-GB')} km`);
	await expect(view.value('seatbeltInstallationCheckDate')).toHaveText('Yes');
	await expect(view.value('numberOfSeatbeltsFitted')).toHaveText(String(type.numberOfSeatbeltsFitted));
	await expect(view.value('lastSeatbeltInstallationCheckDate')).toHaveText(
		displayDate(type.lastSeatbeltInstallationCheckDate ?? '')
	);
	await expect(view.value('additionalNotesRecorded')).toHaveText(type.additionalNotesRecorded ?? '');
	await expect(view.testFacility).toContainText(expected.testStationPNumber ?? '');
	const testerName = expected.testerName ?? '';
	await expect(view.value('testerName')).toHaveText(testerName.charAt(0).toUpperCase() + testerName.slice(1));
	await expect(view.historyRows).toHaveCount(reasons.length);
	for (const [index, reason] of reasons.entries()) {
		await expect(view.historyRows.nth(index).locator('td').first()).toHaveText(reason);
	}
	if (type.testResult === TestResults.ABANDONED && status !== 'cancelled') {
		await expect(view.value('reasonForAbandoning')).toHaveText(`${type.reasonForAbandoning}.`);
		await expect(view.value('additionalCommentsForAbandon')).toHaveText(type.additionalCommentsForAbandon ?? '');
	} else {
		await expect(view.value('reasonForAbandoning')).toBeHidden();
	}
}

async function verifySavedTest(
	pages: PageFactory,
	expected: TestResultSchema,
	reasons: string[],
	status: TestResults | 'cancelled' | null = expected.testTypes[0].testResult
): Promise<void> {
	await viewContingencyTest(pages);
	await verifyTest(pages, expected, reasons, status);
	await pages.page.reload();
	await pages.viewTestResultPage.accordions.open();
	await verifyTest(pages, expected, reasons, status);
}

async function createAnnual(pages: PageFactory, annual: AnnualScenario, expected: TestResultSchema): Promise<void> {
	await startContingencyTest(pages, annual.record, ['Annual test']);
	await expect(pages.createTestResultPage.vehicle.fields.odometerReading.locator).toBeVisible();
	await expect(pages.createTestResultPage.seatbelts.locator).toBeVisible();
	await expect(pages.createTestResultPage.vehicle.fields.vtg15Required.locator).toBeHidden();
	await expect(pages.createTestResultPage.test.fields.vehicleLoadStatus.locator).toBeHidden();
	await fillContingencyTest(pages, expected);
	if (expected.testTypes[0].testResult === TestResults.ABANDONED) {
		await abandonContingencyTest(pages, expected);
	} else {
		await submitContingencyTest(pages, 'POST');
	}
	await expect(pages.viewTechnicalRecordPage.testHistory.locator('#test-record-summary-result-0')).toHaveText(
		new RegExp(`^\\s*${expected.testTypes[0].testResult}\\s*$`, 'i')
	);
	await verifySavedTest(pages, expected, [expected.reasonForCreation ?? '']);
}

async function seedAndAmend(
	pages: PageFactory,
	annual: AnnualScenario,
	api: TestResultsApi
): Promise<TestResultSchema> {
	const original = await api.create(annual.builder.build());
	await openTechnicalRecord(pages, annual.record);
	await viewContingencyTest(pages);
	await verifyTest(pages, original, [original.reasonForCreation ?? '']);
	await startTestAmendment(pages);
	return original;
}

async function setAmendmentReason(pages: PageFactory, reason: string): Promise<void> {
	await pages.amendTestResultPage.reasonForCreation.fill({ reasonForCreation: reason });
}

async function verifyAmendment(
	pages: PageFactory,
	api: TestResultsApi,
	original: TestResultSchema,
	expected: TestResultSchema
): Promise<void> {
	const reasons = [expected.reasonForCreation ?? '', original.reasonForCreation ?? ''];
	await pages.viewTestResultPage.accordions.open();
	await verifyTest(pages, expected, reasons);
	await pages.page.reload();
	await pages.viewTestResultPage.accordions.open();
	await verifyTest(pages, expected, reasons);
	const saved = await api.get(original.systemNumber, original.testResultId);
	expect(saved.testResultId).toBe(original.testResultId);
	expect(saved.testTypes[0].testResult).toBe(expected.testTypes[0].testResult);
	expect(saved.testHistory).toHaveLength(1);
	expect(saved.testHistory?.[0].testTypes[0].testResult).toBe(original.testTypes[0].testResult);
	expect(saved.testHistory?.[0].reasonForCreation).toBe(original.reasonForCreation);
}

test.describe(
	'Group 1 annual contingency tests',
	{
		tag: ['@regression', '@test-result', '@contingency', '@group-1'],
	},
	() => {
		test.setTimeout(60_000);

		test('creates a PASS PSV annual contingency test with odometer and seatbelt information', async ({
			page,
			annual,
		}) => {
			await createAnnual(new PageFactory(page), annual, annual.builder.build());
		});

		test('creates a PRS PSV annual contingency test with a repaired major defect', async ({ page, annual }) => {
			const expected = annual.builder.prs().build();
			const pages = new PageFactory(page);
			await createAnnual(pages, annual, expected);
			await pages.viewTestResultPage.defects.open();
			const defect = pages.viewTestResultPage.defects.content.getByRole('row').last();
			await expect(defect).toContainText('1.1.a');
			await expect(defect.locator('app-tag')).toHaveText(['major', 'Yes']);
		});

		test('creates a FAIL PSV annual contingency test with an unrepaired major defect', async ({ page, annual }) => {
			const expected = annual.builder.fail().build();
			const pages = new PageFactory(page);
			await createAnnual(pages, annual, expected);
			await pages.viewTestResultPage.defects.open();
			const defect = pages.viewTestResultPage.defects.content.getByRole('row').last();
			await expect(defect).toContainText('1.1.a');
			await expect(defect.locator('app-tag')).toHaveText(['major', 'No']);
		});

		test('creates an ABANDONED PSV annual contingency test with a reason and notes', async ({ page, annual }) => {
			await createAnnual(new PageFactory(page), annual, annual.builder.abandoned().build());
		});

		test('amends an API-created PSV annual test and preserves its original version in history', async ({
			page,
			annual,
			testResultsApi,
		}) => {
			const pages = new PageFactory(page);
			const original = await seedAndAmend(pages, annual, testResultsApi);
			const reason = 'Correct odometer, seatbelt and expiry details';
			const expiry = new Date(original.testTypes[0].testExpiryDate ?? '');
			expiry.setUTCMonth(expiry.getUTCMonth() + 1);
			const expected = annual.builder
				.withOdometerReading(54321)
				.withSeatbelts(28, original.testStartTimestamp)
				.withReason(reason)
				.build();
			expected.testTypes[0].testExpiryDate = expiry.toISOString();
			await pages.amendTestResultPage.vehicle.fill({ odometerReading: 54321 });
			await pages.amendTestResultPage.seatbelts.fill({ numberOfSeatbeltsFitted: 28 });
			await pages.amendTestResultPage.test.fill({ testExpiryDate: expiry.toISOString() });
			await setAmendmentReason(pages, reason);
			await submitContingencyTest(pages, 'PUT');
			await verifyAmendment(pages, testResultsApi, original, expected);
			await expect(pages.viewTestResultPage.value('testExpiryDate')).toHaveText(displayDate(expiry.toISOString()));
			await pages.viewTestResultPage.historyRows.nth(1).getByRole('link', { name: 'View', exact: true }).click();
			await pages.viewTestResultPage.accordions.open();
			await expect(pages.viewTestResultPage.result).toHaveText(/pass/i);
			await expect(pages.viewTestResultPage.odometerReading).toHaveText('12,345 km');
			await expect(pages.viewTestResultPage.value('numberOfSeatbeltsFitted')).toHaveText('30');
		});

		test('amends an API-created PSV annual test from PASS to FAIL by adding a major defect', async ({
			page,
			annual,
			testResultsApi,
		}) => {
			const pages = new PageFactory(page);
			const original = await seedAndAmend(pages, annual, testResultsApi);
			const expected = annual.builder.fail().withReason('Correct annual test from pass to fail').build();
			await addDefect(pages, expected.testTypes[0].defects[0]);
			await setAmendmentReason(pages, expected.reasonForCreation ?? '');
			await submitContingencyTest(pages, 'PUT');
			await verifyAmendment(pages, testResultsApi, original, expected);
			await expect(pages.viewTestResultPage.defects.content).toContainText('1.1.a');
		});

		test('amends an API-created PSV annual test from FAIL to PASS by removing its major defect', async ({
			page,
			annual,
			testResultsApi,
		}) => {
			const pages = new PageFactory(page);
			annual.builder.fail();
			const original = await seedAndAmend(pages, annual, testResultsApi);
			const expected = structuredClone(original);
			expected.reasonForCreation = 'Correct annual test from fail to pass';
			expected.testTypes[0].testResult = TestResults.PASS;
			expected.testTypes[0].defects = [];
			await pages.amendTestResultPage.defects.open();
			await pages.amendTestResultPage.defects.defectLinks.click();
			await pages.editDefectPage.removeButton.click();
			await expect(pages.amendTestResultPage.defects.defectLinks).toHaveCount(0);
			await setAmendmentReason(pages, expected.reasonForCreation);
			await submitContingencyTest(pages, 'PUT');
			await verifyAmendment(pages, testResultsApi, original, expected);
			await expect(pages.viewTestResultPage.defects.content).toContainText('No defects');
		});

		test('cancels a submitted API-created PSV annual test and records the cancellation in history', async ({
			page,
			annual,
			testResultsApi,
		}) => {
			const pages = new PageFactory(page);
			const original = await testResultsApi.create(annual.builder.build());
			await openTechnicalRecord(pages, annual.record);
			await viewContingencyTest(pages);
			await pages.viewTestResultPage.cancelTestButton.click();
			await expect(pages.confirmCancelTestPage.reason.locator).toBeVisible();
			const reason = 'Annual test submitted against the wrong vehicle';
			await pages.confirmCancelTestPage.reason.fill(reason);
			await submitTestResult(pages, 'PUT', () => pages.confirmCancelTestPage.submitButton.click());
			await expect(pages.viewTechnicalRecordPage.heading).toBeVisible();
			await verifySavedTest(pages, original, [reason, original.reasonForCreation ?? ''], 'cancelled');
			await expect(pages.viewTestResultPage.amendButton.locator).toBeHidden();
			await expect(pages.viewTestResultPage.cancelTestButton.locator).toBeHidden();
			const cancelled = await testResultsApi.get(original.systemNumber, original.testResultId);
			expect(cancelled.testStatus).toBe('cancelled');
			expect(cancelled.reasonForCancellation).toBe(reason);
			expect(cancelled.testHistory).toHaveLength(1);
		});

		test('backs out of cancelling a PSV annual amendment and restores the entered information', async ({
			page,
			annual,
			testResultsApi,
		}) => {
			const pages = new PageFactory(page);
			const original = await seedAndAmend(pages, annual, testResultsApi);
			const reason = 'Preserve in-progress annual test amendments';
			const expected = annual.builder
				.withOdometerReading(45678)
				.withSeatbelts(27, original.testStartTimestamp)
				.withReason(reason)
				.build();
			await pages.amendTestResultPage.vehicle.fill({ odometerReading: 45678 });
			await pages.amendTestResultPage.seatbelts.fill({ numberOfSeatbeltsFitted: 27 });
			await setAmendmentReason(pages, reason);
			await pages.amendTestResultPage.cancelButton.click();
			await expect(pages.amendTestResultPage.cancelHeading).toBeVisible();
			await expect(pages.amendTestResultPage.discardChangesButton.locator).toBeVisible();
			await pages.amendTestResultPage.restoreChangesButton.click();
			await pages.amendTestResultPage.vehicle.open();
			await expect(pages.amendTestResultPage.vehicle.fields.odometerReading.locator).toHaveValue('45678');
			await pages.amendTestResultPage.seatbelts.open();
			await expect(pages.amendTestResultPage.seatbelts.fields.numberOfSeatbeltsFitted.locator).toHaveValue('27');
			await pages.amendTestResultPage.reasonForCreation.open();
			await expect(pages.amendTestResultPage.reasonForCreation.fields.reasonForCreation.locator).toHaveValue(reason);
			const unchanged = await testResultsApi.get(original.systemNumber, original.testResultId);
			expect(unchanged.odometerReading).toBe(original.odometerReading);
			expect(unchanged.reasonForCreation).toBe(original.reasonForCreation);
			expect(unchanged.testHistory ?? []).toHaveLength(0);
			await submitContingencyTest(pages, 'PUT');
			await verifyAmendment(pages, testResultsApi, original, expected);
		});
	}
);
