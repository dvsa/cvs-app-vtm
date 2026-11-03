import { expect, test } from '@playwright/test';
import { CarBuilder } from '../../builders/vehicle/car.builder';
import { HgvBuilder } from '../../builders/vehicle/hgv.builder';
import { LgvBuilder } from '../../builders/vehicle/lgv.builder';
import { MotorcycleBuilder } from '../../builders/vehicle/motorcycle.builder';
import { PsvBuilder } from '../../builders/vehicle/psv.builder';
import { SmallTrlBuilder } from '../../builders/vehicle/small-trl.builder';
import { TrlBuilder } from '../../builders/vehicle/trl.builder';
import { PageFactory } from '../../page-objects/page.factory';
import type { TechnicalRecord } from '../../page-objects/technical-record/technical-record.page';
import { createTechnicalRecord } from '../../workflows/technical-record/create-technical-record.workflow';

async function createAndVerifyCompleteRecord(pages: PageFactory, record: TechnicalRecord): Promise<void> {
	await createTechnicalRecord(pages, record);
	const view = pages.viewTechnicalRecordPage;
	await expect(view.heading).toBeVisible();
	await expect(view.vin).toHaveText(record.vin);
	const smallTrailer =
		record.techRecord_vehicleType === 'trl' &&
		(record.techRecord_euVehicleCategory === 'o1' || record.techRecord_euVehicleCategory === 'o2');
	await expect(view.vehicleType).toHaveText(smallTrailer ? 'SMALL TRL' : record.techRecord_vehicleType.toUpperCase());
	await expect(view.statusCode).toHaveText('Current');
	await expect(view.recordCompleteness).toHaveText('complete');
	const identifier = record.techRecord_vehicleType === 'trl' ? record.trailerId : record.primaryVrm;
	if (identifier) {
		await expect(record.techRecord_vehicleType === 'trl' ? view.trailerId : view.vrm).toHaveText(
			new RegExp(`^\\s*${identifier.split('').join('\\s*')}\\s*$`)
		);
	}
	await view.clearFilters();
	await view.generalVehicleDetails.open();
	await expect
		.poll(view.generalVehicleDetails.fields.techRecord_noOfAxles.value)
		.toBe(String(record.techRecord_noOfAxles));
	await expect
		.poll(view.generalVehicleDetails.fields.techRecord_vehicleConfiguration.value)
		.toBe(record.techRecord_vehicleConfiguration);
}

test.describe('Complete technical record creation', { tag: ['@smoke', '@technical-record', '@complete'] }, () => {
	test.describe.configure({ timeout: 180_000 });
	test.use({ actionTimeout: 30_000 });

	test('creates a current complete HGV record with vehicle, axle, weight and applicant details', async ({ page }) => {
		const pages = new PageFactory(page);
		const record = new HgvBuilder().complete().withVrm().build();
		await createAndVerifyCompleteRecord(pages, record);
		const view = pages.viewTechnicalRecordPage;
		await expect.poll(view.generalVehicleDetails.fields.techRecord_make.value).toBe(record.techRecord_make);
		await expect.poll(view.generalVehicleDetails.fields.techRecord_model.value).toBe(record.techRecord_model);
		await view.weights.open();
		await expect.poll(view.weights.fields.techRecord_grossGbWeight.value).toBe(String(record.techRecord_grossGbWeight));
		await view.dimensions.open();
		await expect
			.poll(view.dimensions.fields.techRecord_dimensions_length.value)
			.toBe(String(record.techRecord_dimensions_length));
		await view.lastApplicant.open();
		await expect
			.poll(view.lastApplicant.fields.techRecord_applicantDetails_name.value)
			.toBe(record.techRecord_applicantDetails_name);
	});

	test('creates a current complete PSV record with seats, body, chassis and brake details', async ({ page }) => {
		const pages = new PageFactory(page);
		const record = new PsvBuilder().complete().withVrm().build();
		await createAndVerifyCompleteRecord(pages, record);
		const view = pages.viewTechnicalRecordPage;
		await expect.poll(view.generalVehicleDetails.fields.techRecord_bodyMake.value).toBe(record.techRecord_bodyMake);
		await expect.poll(view.generalVehicleDetails.fields.techRecord_bodyModel.value).toBe(record.techRecord_bodyModel);
		await expect
			.poll(view.generalVehicleDetails.fields.techRecord_chassisMake.value)
			.toBe(record.techRecord_chassisMake);
		await expect
			.poll(view.generalVehicleDetails.fields.techRecord_chassisModel.value)
			.toBe(record.techRecord_chassisModel);
		await view.seatsAndVehicleSize.open();
		await expect
			.poll(view.seatsAndVehicleSize.fields.techRecord_seatsLowerDeck.value)
			.toBe(String(record.techRecord_seatsLowerDeck));
		await expect
			.poll(view.seatsAndVehicleSize.fields.techRecord_seatsUpperDeck.value)
			.toBe(String(record.techRecord_seatsUpperDeck));
		await expect.poll(view.seatsAndVehicleSize.fields.techRecord_vehicleSize.value).toBe(record.techRecord_vehicleSize);
		await view.weights.open();
		await expect
			.poll(view.weights.fields.techRecord_grossLadenWeight.value)
			.toBe(String(record.techRecord_grossLadenWeight));
		await expect
			.poll(view.weights.fields.techRecord_grossKerbWeight.value)
			.toBe(String(record.techRecord_grossKerbWeight));
		await view.brakes.open();
		await expect
			.poll(view.brakes.fields.techRecord_brakes_dataTrBrakeOne.value)
			.toBe(record.techRecord_brakes_dataTrBrakeOne);
		await expect
			.poll(view.brakes.fields.techRecord_brakes_dataTrBrakeTwo.value)
			.toBe(record.techRecord_brakes_dataTrBrakeTwo);
		await expect
			.poll(view.brakes.fields.techRecord_brakes_dataTrBrakeThree.value)
			.toBe(record.techRecord_brakes_dataTrBrakeThree);
	});

	test('creates a current complete trailer record with coupling, dimensions and axle details', async ({ page }) => {
		const pages = new PageFactory(page);
		const record = new TrlBuilder().complete().withTrailerId().build();
		await createAndVerifyCompleteRecord(pages, record);
		const view = pages.viewTechnicalRecordPage;
		await expect.poll(view.generalVehicleDetails.fields.techRecord_make.value).toBe(record.techRecord_make);
		await expect.poll(view.generalVehicleDetails.fields.techRecord_model.value).toBe(record.techRecord_model);
		await view.dimensions.open();
		await expect
			.poll(view.dimensions.fields.techRecord_dimensions_length.value)
			.toBe(String(record.techRecord_dimensions_length));
		await view.weights.open();
		await expect
			.poll(view.weights.fields.techRecord_maxLoadOnCoupling.value)
			.toBe(String(record.techRecord_maxLoadOnCoupling));
	});

	test('creates a current complete small trailer record with O2 category and an automatically generated ID', async ({
		page,
	}) => {
		const pages = new PageFactory(page);
		const record = new SmallTrlBuilder().complete().build();
		await createAndVerifyCompleteRecord(pages, record);
		await expect
			.poll(pages.viewTechnicalRecordPage.generalVehicleDetails.fields.techRecord_euVehicleCategory.value)
			.toBe(record.techRecord_euVehicleCategory);
	});

	test('creates a current complete LGV record with its vehicle subclass', async ({ page }) => {
		const pages = new PageFactory(page);
		const record = new LgvBuilder().complete().withVrm().build();
		await createAndVerifyCompleteRecord(pages, record);
		await expect
			.poll(pages.viewTechnicalRecordPage.generalVehicleDetails.fields.techRecord_vehicleSubclass.value)
			.toEqual(record.techRecord_vehicleSubclass);
	});

	test('creates a current complete car record with its vehicle subclass', async ({ page }) => {
		const pages = new PageFactory(page);
		const record = new CarBuilder().complete().withVrm().build();
		await createAndVerifyCompleteRecord(pages, record);
		await expect
			.poll(pages.viewTechnicalRecordPage.generalVehicleDetails.fields.techRecord_vehicleSubclass.value)
			.toEqual(record.techRecord_vehicleSubclass);
	});

	test('creates a current complete motorcycle record with its vehicle class and driven wheels', async ({ page }) => {
		const pages = new PageFactory(page);
		const record = new MotorcycleBuilder().complete().withVrm().build();
		await createAndVerifyCompleteRecord(pages, record);
		const fields = pages.viewTechnicalRecordPage.generalVehicleDetails.fields;
		await expect
			.poll(fields.techRecord_vehicleClass_description.value)
			.toBe(record.techRecord_vehicleClass_description);
		await expect
			.poll(fields.techRecord_numberOfWheelsDriven.value)
			.toBe(String(record.techRecord_numberOfWheelsDriven));
	});
});
