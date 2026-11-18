import type { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { expect } from '@playwright/test';
import type { CreatedTechnicalRecord } from '../../api/technical-records.api';
import type { PageFactory } from '../../page-objects/page.factory';
import { openTechnicalRecord } from '../technical-record/open-technical-record.workflow';
import { addDefect } from './defects/add-defect.workflow';

export async function startContingencyTest(
	pages: PageFactory,
	record: CreatedTechnicalRecord,
	taxonomy: readonly string[]
): Promise<void> {
	await openTechnicalRecord(pages, record);
	await pages.viewTechnicalRecordPage.testRecordsSection.open();
	await pages.viewTechnicalRecordPage.createTestButton.click();
	await pages.chooseTestTypePage.select(taxonomy);
	await expect(pages.createTestResultPage.reviewButton.locator).toBeVisible();
}

export async function fillContingencyTest(pages: PageFactory, record: TestResultSchema): Promise<void> {
	const form = pages.createTestResultPage;
	const type = record.testTypes[0];
	for (const defect of type.defects) await addDefect(pages, defect);
	await form.vehicle.fill({
		countryOfRegistration: 'Great Britain and Northern Ireland - GB',
		euVehicleCategory: record.euVehicleCategory,
		odometerReading: record.odometerReading,
		odometerReadingUnits: record.odometerReadingUnits,
	});
	await form.test.fill({
		contingencyTestNumber: record.contingencyTestNumber,
		testTypeStartTimestamp: type.testTypeStartTimestamp,
		testTypeEndTimestamp: type.testTypeEndTimestamp,
	});
	await form.seatbelts.fill({
		seatbeltInstallationCheckDate: type.seatbeltInstallationCheckDate,
		numberOfSeatbeltsFitted: type.numberOfSeatbeltsFitted,
		lastSeatbeltInstallationCheckDate: type.lastSeatbeltInstallationCheckDate,
	});
	await form.visit.fill({
		testStationPNumber: `${record.testStationName} - ${record.testStationPNumber}`,
		testerStaffId: record.testerName,
	});
	await form.notes.fill({ additionalNotesRecorded: type.additionalNotesRecorded });
	await form.reasonForCreation.fill({ reasonForCreation: record.reasonForCreation });
}

export async function submitContingencyTest(pages: PageFactory, method: 'POST' | 'PUT'): Promise<void> {
	await pages.createTestResultPage.reviewButton.click();
	await expect(pages.page.getByText('Check your answers before submitting the test', { exact: true })).toBeVisible();
	await submitContingencyChange(pages, method, () => pages.createTestResultPage.submitButton.click());
}

export async function abandonContingencyTest(pages: PageFactory, record: TestResultSchema): Promise<void> {
	await pages.createTestResultPage.abandonButton.click();
	const abandon = pages.abandonTestPage;
	await expect(abandon.submitButton).toBeVisible();
	const type = record.testTypes[0];
	if (!type.reasonForAbandoning || !type.additionalCommentsForAbandon) {
		throw new Error('Abandonment scenario requires a reason and notes.');
	}
	await abandon.reasons.fill([type.reasonForAbandoning]);
	await abandon.notes.fill(type.additionalCommentsForAbandon);
	await submitContingencyChange(pages, 'POST', () => abandon.submitButton.click());
}

async function submitContingencyChange(pages: PageFactory, method: 'POST' | 'PUT', submit: () => Promise<void>) {
	const originalUrl = pages.page.url().split('/amend-test/')[0];
	await submitTestResult(pages, method, submit);
	if (method === 'PUT') {
		await expect(pages.page).toHaveURL(originalUrl);
		await expect(pages.viewTestResultPage.history).toBeVisible();
	} else {
		await expect(pages.viewTechnicalRecordPage.heading).toBeVisible();
	}
}

export async function submitTestResult(
	pages: PageFactory,
	method: 'POST' | 'PUT',
	submit: () => Promise<void>
): Promise<void> {
	const [response] = await Promise.all([
		pages.page.waitForResponse(
			(response) =>
				response.request().method() === method && /\/test-results(?:\/[^/?]+)?$/.test(new URL(response.url()).pathname)
		),
		submit(),
	]);
	expect(response.status(), `Submitting test result: ${await response.text()}`).toBe(method === 'POST' ? 201 : 200);
}

export async function viewContingencyTest(pages: PageFactory): Promise<void> {
	await pages.viewTechnicalRecordPage.testRecordsSection.open();
	const link = pages.viewTechnicalRecordPage.viewTestLink;
	await expect(link).toHaveCount(1);
	await link.click();
	await expect(pages.viewTestResultPage.heading).toContainText('Annual test');
	await pages.viewTestResultPage.accordions.open();
}

export async function startTestAmendment(pages: PageFactory): Promise<void> {
	await pages.viewTestResultPage.amendButton.click();
	await pages.amendTestResultPage.reason.fill(2);
	await pages.amendTestResultPage.continueButton.click();
	await expect(pages.amendTestResultPage.reviewButton.locator).toBeVisible();
}
