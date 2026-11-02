import { randomInt, randomUUID } from 'node:crypto';
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
import { generateTrailerId, generateVrm } from '../../builders/vehicle/vehicle.builder';
import { PageFactory } from '../../page-objects/page.factory';
import { createSkeletonTechnicalRecord } from '../../workflows/technical-record/create-skeleton-technical-record.workflow';
import type { SkeletonTechnicalRecord } from '../../workflows/technical-record/populate-skeleton-technical-record.workflow';

async function createAndVerifySkeletonRecord(
	pages: PageFactory,
	skeleton: SkeletonTechnicalRecord,
	generateId = false
): Promise<void> {
	const seed = randomInt(1_000_000, 9_000_000);
	const identifier = skeleton.techRecord_vehicleType === 'trl' ? generateTrailerId(seed) : generateVrm(seed);
	const record: SkeletonTechnicalRecord = {
		...skeleton,
		vin: randomUUID().replaceAll('-', '').slice(0, 17).toUpperCase(),
		...(skeleton.techRecord_vehicleType === 'trl' ? { trailerId: identifier } : { primaryVrm: identifier }),
		techRecord_statusCode: 'current',
		techRecord_reasonForCreation: `Smoke test: create a ${skeleton.techRecord_vehicleType} skeleton record`,
	};

	await createSkeletonTechnicalRecord(pages, { ...record, generateId });

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
	if (!generateId) {
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
		const record = new HgvBuilder().skeleton().build({
			techRecord_vehicleConfiguration: HeavyVehicleConfiguration.RIGID,
		});
		await createAndVerifySkeletonRecord(pages, record);

		const fields = pages.viewTechnicalRecordPage.generalVehicleDetails.fields;
		await expect(fields.techRecord_vehicleConfiguration.locator).toHaveValue(/^(?:\d+: )?rigid$/);
		await expect(fields.techRecord_bodyType_description.locator).toHaveValue(/^(?:\d+: )?box$/);
	});

	test('creates a current PSV skeleton record with DTp number, large PSV class and large vehicle size', async ({
		page,
	}) => {
		const pages = new PageFactory(page);
		const record = new PsvBuilder().skeleton().build({
			techRecord_vehicleConfiguration: HeavyVehicleConfiguration.RIGID,
			techRecord_vehicleSize: 'large',
		});
		await createAndVerifySkeletonRecord(pages, record);

		const view = pages.viewTechnicalRecordPage;
		const fields = view.generalVehicleDetails.fields;
		await expect(fields.techRecord_vehicleConfiguration.locator).toHaveValue(/^(?:\d+: )?rigid$/);
		await expect(fields.techRecord_brakes_dtpNumber.locator).toHaveValue('008633');
		await view.seatsAndVehicleSize.open();
		await expect(view.seatsAndVehicleSize.content.getByRole('radio', { name: 'Large PSV', exact: true })).toBeChecked();
		await expect(view.seatsAndVehicleSize.content.getByRole('radio', { name: 'Large', exact: true })).toBeChecked();
	});

	test('creates a current trailer skeleton record with semi-trailer configuration and box body type', async ({
		page,
	}) => {
		const pages = new PageFactory(page);
		const record = new TrlBuilder().skeleton().build({
			techRecord_vehicleConfiguration: TrailerConfiguration.SEMI_TRAILER,
		});
		await createAndVerifySkeletonRecord(pages, record);

		const fields = pages.viewTechnicalRecordPage.generalVehicleDetails.fields;
		await expect(fields.techRecord_vehicleConfiguration.locator).toHaveValue(/^(?:\d+: )?semi-trailer$/);
		await expect(fields.techRecord_bodyType_description.locator).toHaveValue(/^(?:\d+: )?box$/);
	});

	test('creates a current small trailer skeleton record with O2 EU vehicle category', async ({ page }) => {
		const pages = new PageFactory(page);
		await createAndVerifySkeletonRecord(pages, new SmallTrlBuilder().skeleton().build(), true);

		const fields = pages.viewTechnicalRecordPage.generalVehicleDetails.fields;
		await expect(
			fields.techRecord_euVehicleCategory.locator.getByRole('radio', { name: 'O2', exact: true })
		).toBeChecked();
	});

	test('creates a current LGV skeleton record and displays its saved identifiers and status', async ({ page }) => {
		const pages = new PageFactory(page);
		await createAndVerifySkeletonRecord(pages, new LgvBuilder().skeleton().build());
	});

	test('creates a current car skeleton record and displays its saved identifiers and status', async ({ page }) => {
		const pages = new PageFactory(page);
		await createAndVerifySkeletonRecord(pages, new CarBuilder().skeleton().build());
	});

	test('creates a current motorcycle skeleton record with the over 200cc or sidecar vehicle class', async ({
		page,
	}) => {
		const pages = new PageFactory(page);
		await createAndVerifySkeletonRecord(pages, new MotorcycleBuilder().skeleton().build());

		const fields = pages.viewTechnicalRecordPage.generalVehicleDetails.fields;
		await expect(fields.techRecord_vehicleClass_description.locator).toHaveValue(
			/^(?:\d+: )?motorbikes over 200cc or with a sidecar$/
		);
	});
});
