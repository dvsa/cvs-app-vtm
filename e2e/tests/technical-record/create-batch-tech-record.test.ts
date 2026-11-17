import { gunzipSync } from 'node:zlib';
import { CompressionHeaders } from '@dvsa/cvs-microservice-common/api/headers';
import type { Locator } from '@playwright/test';
import type { CreatedTechnicalRecord } from '../../api/technical-records.api';
import { BatchBuilder, type BatchDefinition } from '../../builders/batch.builder';
import { HgvBuilder } from '../../builders/vehicle/hgv.builder';
import { PsvBuilder } from '../../builders/vehicle/psv.builder';
import { TrlBuilder } from '../../builders/vehicle/trl.builder';
import { generateVin } from '../../builders/vehicle/vehicle.builder';
import type { Button } from '../../components/button.component';
import { expect, test } from '../../fixtures/api.fixture';
import { PageFactory } from '../../page-objects/page.factory';
import { createBatch, openBatchCreation } from '../../workflows/batch/create-batch.workflow';

async function expectProcessedBatch(
	pages: PageFactory,
	batch: BatchDefinition,
	operation: 'created' | 'updated' = 'created'
): Promise<void> {
	const summary = pages.batchSummaryPage;
	const descriptor = batch.vehicleType === 'trl' ? 'trailer' : batch.vehicleType.toUpperCase();
	await expect(summary.successBanner).toContainText(
		`Successfully processed ${batch.vehicles.length} ${descriptor} technical records.`,
		{ timeout: 120_000 }
	);
	await expect(summary.successBanner).toContainText(
		`You have ${operation} ${batch.vehicles.length} technical records.`
	);
	await expect(summary.progressBanner).toBeHidden();
	await expect(summary.failedRecords).toHaveCount(0);
	await expect(summary.successfulRecords).toHaveCount(batch.vehicles.length);
	await expect(summary.retryButton.locator).toBeHidden();
	for (const vehicle of batch.vehicles) {
		await expect(summary.successfulRecord(vehicle.vin)).toBeVisible();
		await expect(summary.recordStatus(vehicle.vin)).toHaveText(batch.status.toUpperCase());
	}

	const vehicle = batch.vehicles[0];
	const view = await summary.openRecord(vehicle.vin);
	await expect(view.heading).toBeVisible();
	await expect(view.vin).toHaveText(vehicle.vin);
	await expect(view.vehicleType).toHaveText(batch.vehicleType.toUpperCase());
	await expect(view.statusCode).toHaveText(batch.status === 'current' ? 'Current' : 'Provisional');
	if (vehicle.trailerIdOrVrm) {
		await expect(batch.vehicleType === 'trl' ? view.trailerId : view.vrm).toHaveText(
			new RegExp(`^\\s*${vehicle.trailerIdOrVrm.split('').join('\\s*')}\\s*$`)
		);
	}
	await view.clearFilters();
	await view.generalVehicleDetails.open();
	await expect
		.poll(view.generalVehicleDetails.fields.techRecord_vehicleConfiguration.value)
		.toBe(batch.record.techRecord_vehicleConfiguration);
	await view.page.close();
}

async function expectFormErrors(pages: PageFactory, button: Button, errors: string[]): Promise<void> {
	await pages.page.locator('main h1').first().click();
	await expect(pages.page.locator('form.ng-pending')).toHaveCount(0);
	// Invalid submissions are safe to retry when the app's one-second click throttle is still active.
	await expect(async () => {
		await button.click();
		await expect(pages.page.locator('.govuk-error-summary__list li')).toHaveText(errors, { timeout: 1_500 });
	}).toPass({ intervals: [1_100], timeout: 10_000 });
}

async function continueAfterValidation(button: Button, nextHeading: Locator): Promise<void> {
	await expect(button.locator.page().locator('form.ng-pending')).toHaveCount(0);
	await expect(async () => {
		if (!(await nextHeading.isVisible())) await button.click();
		await expect(nextHeading).toBeVisible({ timeout: 1_500 });
	}).toPass({ intervals: [1_100], timeout: 10_000 });
}

async function validateBatchFields(
	pages: PageFactory,
	batch: BatchDefinition,
	existing: CreatedTechnicalRecord,
	invalidSize: string,
	recordErrors: string[]
): Promise<void> {
	await openBatchCreation(pages);
	const details = pages.enterBatchDetailsPage;
	if (batch.vehicleType === 'hgv') {
		await expectFormErrors(pages, details.continueButton, ['Vehicle status is required', 'Vehicle type is required']);
	}
	if (batch.vehicleType === 'trl') {
		await details.vehicleStatus.fill('provisional');
		await details.vehicleTypeOption('trl').check();
		await expectFormErrors(pages, details.continueButton, ['Select a trailer form type']);
		await details.trailerFormType.fill('tes2');
		await expect(details.tes2).toBeChecked();
		await details.vehicleStatus.fill('current');
		await expect(details.tes1).toBeChecked();
		await expect(details.tes1).toBeDisabled();
		await expect(details.tes2).toBeDisabled();
		await expect(details.trailerFormTypeHint).toBeVisible();
		await details.vehicleStatus.fill('provisional');
		await expect(details.tes1).not.toBeChecked();
		await expect(details.tes2).not.toBeChecked();
		await expect(details.tes1).toBeEnabled();
		await expect(details.tes2).toBeEnabled();
		await expect(details.trailerFormTypeHint).toBeHidden();
	}
	await details.fill(batch);
	await continueAfterValidation(details.continueButton, pages.enterBatchSizePage.heading);

	const size = pages.enterBatchSizePage;
	await size.size.fill(invalidSize);
	await expectFormErrors(pages, size.continueButton, ['Enter a number between 1 to 41']);
	await expect(size.heading).toBeVisible();
	await size.size.fill(2);
	await size.heading.click();
	await continueAfterValidation(size.continueButton, pages.enterBatchIdentifiersPage.heading);

	const identifiers = pages.enterBatchIdentifiersPage;
	const vin = identifiers.vin(0);
	const identifier = identifiers.identifier(0);
	if (batch.vehicleType === 'hgv') {
		for (const [invalidVin, error] of [
			['56', 'Vehicle 1 - VIN must be greater than or equal to 3 characters'],
			['1'.repeat(22), 'Vehicle 1 - VIN must be less than or equal to 21 characters'],
			['ABC-123', 'Vehicle 1 - VIN must be alphanumeric'],
			['ABCQ123', 'Vehicle 1 - VIN should not contain O, I or Q'],
		]) {
			await vin.fill(invalidVin);
			await expectFormErrors(pages, identifiers.confirmButton, [error]);
			await expect(identifiers.heading).toBeVisible();
		}
	}
	if (batch.vehicleType === 'psv') {
		await expectFormErrors(pages, identifiers.confirmButton, ['At least 1 vehicle must have a VIN']);
		await vin.fill(generateVin());
		await identifier.fill('A'.repeat(10));
		await expectFormErrors(pages, identifiers.confirmButton, [
			'Vehicle 1 - VRM must be less than or equal to 9 characters',
		]);
	}
	if (batch.vehicleType === 'trl') {
		const duplicateVin = generateVin();
		await vin.fill(duplicateVin);
		await identifiers.vin(1).fill(duplicateVin);
		await expectFormErrors(pages, identifiers.confirmButton, ['Vehicle 2 - Remove duplicate VIN']);
		await identifiers.vin(1).fill('');
		for (const [invalidId, error] of [
			['A'.repeat(6), 'Vehicle 1 - Trailer ID must be greater than or equal to 7 characters'],
			['A'.repeat(9), 'Vehicle 1 - Trailer ID must be less than or equal to 8 characters'],
		]) {
			await identifier.fill(invalidId);
			await expectFormErrors(pages, identifiers.confirmButton, [error]);
		}
	}

	await vin.fill(existing.vin);
	await identifier.fill('NOMATCH1');
	const label = batch.vehicleType === 'trl' ? 'Trailer ID' : 'VRM';
	await expectFormErrors(pages, identifiers.confirmButton, [
		`Vehicle 1 - Could not find a record with matching VIN and ${label}`,
	]);
	await identifier.fill('');
	await vin.fill(generateVin());
	await identifiers.identifier(1).fill('NOMATCH1');
	await expectFormErrors(pages, identifiers.confirmButton, ['Vehicle 2 - VIN is required']);

	await identifiers.identifier(1).fill('');
	await identifiers.fill(batch.vehicles);
	await continueAfterValidation(identifiers.confirmButton, pages.enterTechRecordDetailsPage.heading);
	await expectFormErrors(pages, pages.enterTechRecordDetailsPage.saveButton, recordErrors);
	await expect(pages.enterTechRecordDetailsPage.heading).toBeVisible();

	await pages.enterTechRecordDetailsPage.cancelLink.click();
	await expect(pages.cancelBatchPage.heading).toBeVisible();
	await pages.cancelBatchPage.cancelButton.click();
	const createLink = pages.page.getByRole('link', { name: 'Create a batch of technical records', exact: true });
	await expect(createLink).toBeVisible();
	await createLink.click();
	await expect(details.heading).toBeVisible();
	await expect(details.vehicleTypeOption(batch.vehicleType)).not.toBeChecked();
	await expect(details.vehicleTypeOption(batch.vehicleType)).toBeEnabled();
	await expect(details.vehicleStatus.locator.getByRole('radio', { checked: true })).toHaveCount(0);
}

test.describe(
	'Redesigned batch technical record creation',
	{ tag: ['@regression', '@technical-record', '@batch'] },
	() => {
		test.describe.configure({ timeout: 120_000 });

		test.beforeEach(async ({ page }) => {
			await page.route('**/feature-flags/VTM', async (route) => {
				const response = await route.fetch();
				expect(response.ok(), 'Loading feature flags before enabling batch-redesign').toBeTruthy();
				const flags: Record<string, { enabled: boolean }> = await response.json();
				await route.fulfill({ response, json: { ...flags, 'batch-redesign': { enabled: true } } });
			});
		});

		test('creates a provisional HGV batch using VINs and opens a created record', async ({ page }) => {
			const pages = new PageFactory(page);
			const batch = new BatchBuilder('hgv').provisional().withSize(2).build();
			await createBatch(pages, batch);
			await expectProcessedBatch(pages, batch);
		});

		test('creates a current PSV batch using VINs and opens a created record', async ({ page }) => {
			const pages = new PageFactory(page);
			const batch = new BatchBuilder('psv').current().withSize(2).build();
			await createBatch(pages, batch);
			await expectProcessedBatch(pages, batch);
		});

		test('creates a current trailer batch with TES1 enforced and opens a created record', async ({ page }) => {
			const pages = new PageFactory(page);
			const batch = new BatchBuilder('trl').current().withSize(2).build();
			await createBatch(pages, batch);
			await expectProcessedBatch(pages, batch);
		});

		test('creates a provisional TES1 trailer batch and opens a created record', async ({ page }) => {
			const pages = new PageFactory(page);
			const batch = new BatchBuilder('trl').provisional().withTrailerFormType('tes1').withSize(2).build();
			await createBatch(pages, batch);
			await expectProcessedBatch(pages, batch);
		});

		test('creates a provisional TES2 trailer batch and opens a created record', async ({ page }) => {
			const pages = new PageFactory(page);
			const batch = new BatchBuilder('trl').provisional().withTrailerFormType('tes2').withSize(2).build();
			await createBatch(pages, batch);
			await expectProcessedBatch(pages, batch);
		});

		test('updates an API-created HGV batch using matching VINs and VRMs', async ({ page, technicalRecordsApi }) => {
			const records = [
				new HgvBuilder().testable().provisional().withVrm().build(),
				new HgvBuilder().testable().provisional().withVrm().build(),
			];
			await Promise.all(records.map((record) => technicalRecordsApi.create(record)));
			const batch = new BatchBuilder('hgv')
				.provisional()
				.withVehicles(records.map((record) => ({ vin: record.vin, trailerIdOrVrm: record.primaryVrm ?? undefined })))
				.build();
			const pages = new PageFactory(page);
			await createBatch(pages, batch);
			await expectProcessedBatch(pages, batch, 'updated');
		});

		test('updates an API-created PSV batch using matching VINs and VRMs', async ({ page, technicalRecordsApi }) => {
			const records = [
				new PsvBuilder().testable().current().withVrm().build(),
				new PsvBuilder().testable().current().withVrm().build(),
			];
			await Promise.all(records.map((record) => technicalRecordsApi.create(record)));
			const batch = new BatchBuilder('psv')
				.current()
				.withVehicles(records.map((record) => ({ vin: record.vin, trailerIdOrVrm: record.primaryVrm ?? undefined })))
				.build();
			const pages = new PageFactory(page);
			await createBatch(pages, batch);
			await expectProcessedBatch(pages, batch, 'updated');
		});

		test('updates an API-created provisional trailer batch using matching VINs and trailer IDs', async ({
			page,
			technicalRecordsApi,
		}) => {
			const records = [
				new TrlBuilder().testable().provisional().withTrailerId().build(),
				new TrlBuilder().testable().provisional().withTrailerId().build(),
			];
			await Promise.all(records.map((record) => technicalRecordsApi.create(record)));
			const batch = new BatchBuilder('trl')
				.provisional()
				.withTrailerFormType('tes2')
				.withVehicles(records.map((record) => ({ vin: record.vin, trailerIdOrVrm: record.trailerId ?? undefined })))
				.build();
			const pages = new PageFactory(page);
			await createBatch(pages, batch);
			await expectProcessedBatch(pages, batch, 'updated');
		});

		test('validates HGV batch selections, missing size, VIN formats, identifiers and required details before cancellation', async ({
			page,
			technicalRecordsApi,
		}) => {
			const existing = await technicalRecordsApi.create(new HgvBuilder().testable().withVrm().build());
			await validateBatchFields(
				new PageFactory(page),
				new BatchBuilder('hgv').provisional().withSize(2).build(),
				existing,
				'',
				['Vehicle configuration is required', 'Body type is required', 'Reason for creation is required']
			);
		});

		test('validates PSV batch zero size, missing VIN, VRM format and required details before cancellation', async ({
			page,
			technicalRecordsApi,
		}) => {
			const existing = await technicalRecordsApi.create(new PsvBuilder().testable().withVrm().build());
			await validateBatchFields(
				new PageFactory(page),
				new BatchBuilder('psv').current().withSize(2).build(),
				existing,
				'0',
				[
					'DTp number is required',
					'Vehicle configuration is required',
					'Vehicle class is required',
					'Vehicle size is required',
					'Reason for creation is required',
				]
			);
		});

		test('validates trailer TES1 and TES2 rules, oversized batch, duplicate VIN and trailer IDs before cancellation', async ({
			page,
			technicalRecordsApi,
		}) => {
			const existing = await technicalRecordsApi.create(new TrlBuilder().testable().withTrailerId().build());
			await validateBatchFields(
				new PageFactory(page),
				new BatchBuilder('trl').provisional().withTrailerFormType('tes2').withSize(2).build(),
				existing,
				'42',
				['Vehicle configuration is required', 'Body type is required', 'Reason for creation is required']
			);
		});

		test('shows a failed HGV batch record and retries only the failed creation successfully', async ({ page }) => {
			const pages = new PageFactory(page);
			const batch = new BatchBuilder('hgv').provisional().withSize(2).build();
			const [successful, failed] = batch.vehicles;
			const attempts: string[] = [];
			let rejectCreation = true;
			await page.route('**/tech-records/v4', async (route) => {
				if (route.request().method() !== 'POST') return route.continue();
				const request = route.request();
				const body = request.postData();
				if (!body) throw new Error('Batch record creation must send a request body.');
				const compressed =
					request.headers()[CompressionHeaders.outbound.request.toLowerCase()] === CompressionHeaders.compressionValue;
				const record: { vin: string } = JSON.parse(
					compressed ? gunzipSync(Buffer.from(body, 'base64')).toString('utf8') : body
				);
				attempts.push(record.vin);
				if (record.vin === failed.vin && rejectCreation) {
					rejectCreation = false;
					return route.fulfill({
						status: 400,
						json: { errors: ['Batch creation rejected for retry coverage'] },
					});
				}
				return route.continue();
			});

			await createBatch(pages, batch);
			const summary = pages.batchSummaryPage;
			await expect(summary.progressBanner).toBeHidden();
			await expect(summary.successfulRecords).toHaveCount(1);
			await expect(summary.successfulRecord(successful.vin)).toBeVisible();
			await expect(summary.failedRecords).toHaveCount(1);
			await expect(summary.failedRecords).toContainText(failed.vin);
			await expect(summary.failedRecords).toContainText('Failed to create');
			await expect(summary.successBanner).toBeHidden();
			await expect(summary.homeButton.locator).toBeHidden();
			await expect(page.locator('.govuk-error-summary__list')).toContainText(
				'Batch creation rejected for retry coverage'
			);
			await summary.retryButton.click();
			await expectProcessedBatch(pages, batch);
			await expect(page.locator('.govuk-error-summary__list')).toBeHidden();
			expect(attempts.filter((vin) => vin === successful.vin)).toHaveLength(1);
			expect(attempts.filter((vin) => vin === failed.vin)).toHaveLength(2);
		});
	}
);
