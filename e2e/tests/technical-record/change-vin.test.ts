import type { CreatedTechnicalRecord } from '../../api/technical-records.api';
import { CarBuilder } from '../../builders/vehicle/car.builder';
import { HgvBuilder } from '../../builders/vehicle/hgv.builder';
import { LgvBuilder } from '../../builders/vehicle/lgv.builder';
import { MotorcycleBuilder } from '../../builders/vehicle/motorcycle.builder';
import { PsvBuilder } from '../../builders/vehicle/psv.builder';
import { SmallTrlBuilder } from '../../builders/vehicle/small-trl.builder';
import { TrlBuilder } from '../../builders/vehicle/trl.builder';
import { generateVin } from '../../builders/vehicle/vehicle.builder';
import { expect, test } from '../../fixtures/api.fixture';
import { PageFactory } from '../../page-objects/page.factory';
import { changeVin } from '../../workflows/technical-record/change-vin.workflow';
import { openTechnicalRecord } from '../../workflows/technical-record/open-technical-record.workflow';

async function changeAndVerifyVin(pages: PageFactory, record: CreatedTechnicalRecord): Promise<void> {
	await openTechnicalRecord(pages, record);
	const newVin = generateVin();
	await changeVin(pages, newVin);
	await pages.page.reload();
	await expect(pages.viewTechnicalRecordPage.vin).toHaveText(newVin);
}

async function verifyVinRequired(pages: PageFactory, record: CreatedTechnicalRecord): Promise<void> {
	await openTechnicalRecord(pages, record);
	await pages.viewTechnicalRecordPage.changeVinLink.click();

	const change = pages.changeVinPage;
	await expect(change.heading).toBeVisible();
	await change.saveButton.click();
	await expect(change.requiredVinError).toHaveText('VIN is required');
	await expect(pages.page).toHaveURL(/\/change-vin$/);
	await expect(change.heading).toBeVisible();
}

test.describe('Change vehicle VIN', { tag: ['@regression', '@technical-record'] }, () => {
	test('changes the VIN for a HGV', async ({ page, technicalRecordsApi }) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(new HgvBuilder().provisional().skeleton().withVrm().build());
		await changeAndVerifyVin(pages, record);
	});

	test('requires a VIN when changing the VIN for a HGV', async ({ page, technicalRecordsApi }) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(new HgvBuilder().provisional().skeleton().withVrm().build());
		await verifyVinRequired(pages, record);
	});

	test('changes the VIN for a LGV', async ({ page, technicalRecordsApi }) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(new LgvBuilder().provisional().skeleton().withVrm().build());
		await changeAndVerifyVin(pages, record);
	});

	test('requires a VIN when changing the VIN for a LGV', async ({ page, technicalRecordsApi }) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(new LgvBuilder().provisional().skeleton().withVrm().build());
		await verifyVinRequired(pages, record);
	});

	test('changes the VIN for a PSV', async ({ page, technicalRecordsApi }) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(new PsvBuilder().provisional().skeleton().withVrm().build());
		await changeAndVerifyVin(pages, record);
	});

	test('requires a VIN when changing the VIN for a PSV', async ({ page, technicalRecordsApi }) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(new PsvBuilder().provisional().skeleton().withVrm().build());
		await verifyVinRequired(pages, record);
	});

	test('changes the VIN for a TRL', async ({ page, technicalRecordsApi }) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(new TrlBuilder().provisional().skeleton().withTrailerId().build());
		await changeAndVerifyVin(pages, record);
	});

	test('requires a VIN when changing the VIN for a TRL', async ({ page, technicalRecordsApi }) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(new TrlBuilder().provisional().skeleton().withTrailerId().build());
		await verifyVinRequired(pages, record);
	});

	test('changes the VIN for a small TRL', async ({ page, technicalRecordsApi }) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(
			new SmallTrlBuilder().provisional().skeleton().withTrailerId().build()
		);
		await changeAndVerifyVin(pages, record);
	});

	test('requires a VIN when changing the VIN for a small TRL', async ({ page, technicalRecordsApi }) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(
			new SmallTrlBuilder().provisional().skeleton().withTrailerId().build()
		);
		await verifyVinRequired(pages, record);
	});

	test('changes the VIN for a car', async ({ page, technicalRecordsApi }) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(new CarBuilder().provisional().skeleton().withVrm().build());
		await changeAndVerifyVin(pages, record);
	});

	test('requires a VIN when changing the VIN for a car', async ({ page, technicalRecordsApi }) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(new CarBuilder().provisional().skeleton().withVrm().build());
		await verifyVinRequired(pages, record);
	});

	test('changes the VIN for a motorcycle', async ({ page, technicalRecordsApi }) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(new MotorcycleBuilder().provisional().skeleton().withVrm().build());
		await changeAndVerifyVin(pages, record);
	});

	test('requires a VIN when changing the VIN for a motorcycle', async ({ page, technicalRecordsApi }) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(new MotorcycleBuilder().provisional().skeleton().withVrm().build());
		await verifyVinRequired(pages, record);
	});

	test('returns to the same technical record when going back from Change VIN', async ({
		page,
		technicalRecordsApi,
	}) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(new PsvBuilder().provisional().skeleton().withVrm().build());
		await openTechnicalRecord(pages, record);
		const recordURL = page.url();
		await pages.viewTechnicalRecordPage.changeVinLink.click();
		await expect(pages.changeVinPage.heading).toBeVisible();
		await pages.changeVinPage.backButton.click();

		await expect(page).toHaveURL(recordURL);
		await expect(pages.viewTechnicalRecordPage.heading).toBeVisible();
		await expect(pages.viewTechnicalRecordPage.vin).toHaveText(record.vin);
		await expect(pages.viewTechnicalRecordPage.changeVinLink.locator).toBeVisible();
	});
});
