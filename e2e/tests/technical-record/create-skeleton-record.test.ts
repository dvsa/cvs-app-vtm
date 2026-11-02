import { VehicleConfiguration as HeavyVehicleConfiguration } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationHgvPsv.enum.js';
import { VehicleConfiguration as TrailerConfiguration } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationTrl.enum.js';
import { expect, test } from '@playwright/test';
import { CarBuilder } from '../../builders/vehicle/car.builder';
import { HgvBuilder } from '../../builders/vehicle/hgv.builder';
import { LgvBuilder } from '../../builders/vehicle/lgv.builder';
import { MotorcycleBuilder } from '../../builders/vehicle/motorcycle.builder';
import { PsvBuilder } from '../../builders/vehicle/psv.builder';
import { SmallTrlBuilder } from '../../builders/vehicle/small-trl.builder';
import { TrlBuilder } from '../../builders/vehicle/trl.builder';
import { PageFactory } from '../../page-objects/page.factory';
import { createSkeletonTechnicalRecord } from '../../workflows/technical-record/create-skeleton-technical-record.workflow';
import type { SkeletonTechnicalRecord } from '../../workflows/technical-record/populate-skeleton-technical-record.workflow';

async function createAndVerifySkeletonRecord(pages: PageFactory, record: SkeletonTechnicalRecord): Promise<void> {
	await createSkeletonTechnicalRecord(pages, record);

	const view = pages.viewTechnicalRecordPage;
	await expect(view.heading).toBeVisible();
	await expect(view.vin).toHaveText(record.vin);
	const vehicleType =
		record.techRecord_vehicleType === 'trl' &&
		(record.techRecord_euVehicleCategory === 'o1' || record.techRecord_euVehicleCategory === 'o2')
			? 'SMALL TRL'
			: record.techRecord_vehicleType.toUpperCase();
	await expect(view.vehicleType).toHaveText(vehicleType);
	await expect(view.statusCode).toHaveText('Current');
	await expect(view.recordCompleteness).toHaveText('skeleton');
	const identifier = record.techRecord_vehicleType === 'trl' ? record.trailerId : record.primaryVrm;
	if (identifier) {
		await expect(record.techRecord_vehicleType === 'trl' ? view.trailerId : view.vrm).toHaveText(
			new RegExp(`^\\s*${identifier.split('').join('\\s*')}\\s*$`)
		);
	}

	await view.generalVehicleDetails.open();
}

test.describe('Skeleton technical record creation', { tag: ['@smoke', '@technical-record'] }, () => {
	test.describe.configure({ timeout: 120_000 });

	test('creates a current HGV skeleton record with rigid configuration and box body type', async ({ page }) => {
		const pages = new PageFactory(page);
		const record = new HgvBuilder().skeleton().withVrm().build({
			techRecord_vehicleConfiguration: HeavyVehicleConfiguration.RIGID,
		});
		await createAndVerifySkeletonRecord(pages, record);

		const fields = pages.viewTechnicalRecordPage.generalVehicleDetails.fields;
		await expect.poll(fields.techRecord_vehicleConfiguration.value).toBe(record.techRecord_vehicleConfiguration);
		await expect.poll(fields.techRecord_bodyType_description.value).toBe(record.techRecord_bodyType_description);
	});

	test('creates a current PSV skeleton record with DTp number, large PSV class and large vehicle size', async ({
		page,
	}) => {
		const pages = new PageFactory(page);
		const record = new PsvBuilder().skeleton().withVrm().build({
			techRecord_vehicleConfiguration: HeavyVehicleConfiguration.RIGID,
			techRecord_vehicleSize: 'large',
		});
		await createAndVerifySkeletonRecord(pages, record);

		const view = pages.viewTechnicalRecordPage;
		const fields = view.generalVehicleDetails.fields;
		await expect.poll(fields.techRecord_vehicleConfiguration.value).toBe(record.techRecord_vehicleConfiguration);
		await expect.poll(fields.techRecord_brakes_dtpNumber.value).toBe(record.techRecord_brakes_dtpNumber);
		await view.seatsAndVehicleSize.open();
		await expect
			.poll(view.seatsAndVehicleSize.fields.techRecord_vehicleClass_description.value)
			.toBe(record.techRecord_vehicleClass_description);
		await expect.poll(view.seatsAndVehicleSize.fields.techRecord_vehicleSize.value).toBe(record.techRecord_vehicleSize);
	});

	test('creates a current trailer skeleton record with semi-trailer configuration and box body type', async ({
		page,
	}) => {
		const pages = new PageFactory(page);
		const record = new TrlBuilder().skeleton().withTrailerId().build({
			techRecord_vehicleConfiguration: TrailerConfiguration.SEMI_TRAILER,
		});
		await createAndVerifySkeletonRecord(pages, record);

		const fields = pages.viewTechnicalRecordPage.generalVehicleDetails.fields;
		await expect.poll(fields.techRecord_vehicleConfiguration.value).toBe(record.techRecord_vehicleConfiguration);
		await expect.poll(fields.techRecord_bodyType_description.value).toBe(record.techRecord_bodyType_description);
	});

	test('creates a current small trailer skeleton record with O2 EU vehicle category', async ({ page }) => {
		const pages = new PageFactory(page);
		const record = new SmallTrlBuilder().skeleton().build();
		await createAndVerifySkeletonRecord(pages, record);

		const fields = pages.viewTechnicalRecordPage.generalVehicleDetails.fields;
		await expect.poll(fields.techRecord_euVehicleCategory.value).toBe(record.techRecord_euVehicleCategory);
	});

	test('creates a current LGV skeleton record and displays its saved identifiers and status', async ({ page }) => {
		const pages = new PageFactory(page);
		const record = new LgvBuilder().skeleton().withVrm().build();
		await createAndVerifySkeletonRecord(pages, record);
	});

	test('creates a current car skeleton record and displays its saved identifiers and status', async ({ page }) => {
		const pages = new PageFactory(page);
		const record = new CarBuilder().skeleton().withVrm().build();
		await createAndVerifySkeletonRecord(pages, record);
	});

	test('creates a current motorcycle skeleton record with the over 200cc or sidecar vehicle class', async ({
		page,
	}) => {
		const pages = new PageFactory(page);
		const record = new MotorcycleBuilder().skeleton().withVrm().build();
		await createAndVerifySkeletonRecord(pages, record);

		const fields = pages.viewTechnicalRecordPage.generalVehicleDetails.fields;
		await expect
			.poll(fields.techRecord_vehicleClass_description.value)
			.toBe(record.techRecord_vehicleClass_description);
	});
});
