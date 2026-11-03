import type { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { expect, test } from '@playwright/test';
import { HgvBuilder } from '../../builders/vehicle/hgv.builder';
import { PsvBuilder } from '../../builders/vehicle/psv.builder';
import { TrlBuilder } from '../../builders/vehicle/trl.builder';
import { PageFactory } from '../../page-objects/page.factory';
import { createTechnicalRecord } from '../../workflows/technical-record/create-technical-record.workflow';

async function createAndVerifyTestableRecord(
	pages: PageFactory,
	record: TechRecordType<'hgv' | 'psv' | 'trl', 'put'>
): Promise<void> {
	await createTechnicalRecord(pages, record);

	const view = pages.viewTechnicalRecordPage;
	await expect(view.heading).toBeVisible();
	await expect(view.vin).toHaveText(record.vin);
	await expect(view.vehicleType).toHaveText(record.techRecord_vehicleType.toUpperCase());
	await expect(view.statusCode).toHaveText('Current');
	await expect(view.recordCompleteness).toHaveText('testable');
	const identifier = record.techRecord_vehicleType === 'trl' ? record.trailerId : record.primaryVrm;
	if (identifier) {
		await expect(record.techRecord_vehicleType === 'trl' ? view.trailerId : view.vrm).toHaveText(
			new RegExp(`^\\s*${identifier.split('').join('\\s*')}\\s*$`)
		);
	}
	await view.generalVehicleDetails.open();
	await expect
		.poll(view.generalVehicleDetails.fields.techRecord_noOfAxles.value)
		.toBe(String(record.techRecord_noOfAxles));
}

test.describe('Testable technical record creation', { tag: ['@smoke', '@technical-record', '@testable'] }, () => {
	test.describe.configure({ timeout: 120_000 });

	test('creates a current HGV testable record with rigid configuration, box body type and two axles', async ({
		page,
	}) => {
		const pages = new PageFactory(page);
		const record = new HgvBuilder().testable().withVrm().build();
		await createAndVerifyTestableRecord(pages, record);

		const fields = pages.viewTechnicalRecordPage.generalVehicleDetails.fields;
		await expect.poll(fields.techRecord_vehicleConfiguration.value).toBe(record.techRecord_vehicleConfiguration);
		await expect.poll(fields.techRecord_bodyType_description.value).toBe(record.techRecord_bodyType_description);
	});

	test('creates a current PSV testable record with two axles, deck seat counts and large vehicle size', async ({
		page,
	}) => {
		const pages = new PageFactory(page);
		const record = new PsvBuilder().testable().withVrm().build();
		await createAndVerifyTestableRecord(pages, record);

		const view = pages.viewTechnicalRecordPage;
		const fields = view.generalVehicleDetails.fields;
		await expect.poll(fields.techRecord_vehicleConfiguration.value).toBe(record.techRecord_vehicleConfiguration);
		await expect.poll(fields.techRecord_brakes_dtpNumber.value).toBe(record.techRecord_brakes_dtpNumber);
		await view.seatsAndVehicleSize.open();
		await expect
			.poll(view.seatsAndVehicleSize.fields.techRecord_seatsLowerDeck.value)
			.toBe(String(record.techRecord_seatsLowerDeck));
		await expect
			.poll(view.seatsAndVehicleSize.fields.techRecord_seatsUpperDeck.value)
			.toBe(String(record.techRecord_seatsUpperDeck));
		await expect
			.poll(view.seatsAndVehicleSize.fields.techRecord_vehicleClass_description.value)
			.toBe(record.techRecord_vehicleClass_description);
		await expect.poll(view.seatsAndVehicleSize.fields.techRecord_vehicleSize.value).toBe(record.techRecord_vehicleSize);
	});

	test('creates a current trailer testable record with semi-trailer configuration, box body type and two axles', async ({
		page,
	}) => {
		const pages = new PageFactory(page);
		const record = new TrlBuilder().testable().withTrailerId().build();
		await createAndVerifyTestableRecord(pages, record);

		const fields = pages.viewTechnicalRecordPage.generalVehicleDetails.fields;
		await expect.poll(fields.techRecord_vehicleConfiguration.value).toBe(record.techRecord_vehicleConfiguration);
		await expect.poll(fields.techRecord_bodyType_description.value).toBe(record.techRecord_bodyType_description);
	});
});
