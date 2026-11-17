import { isValidObject } from '@dvsa/cvs-type-definitions/schema-validator';
import { TC3Types } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tc3Types.enum.js';
import dayjs from 'dayjs';
import type { CreatedTechnicalRecord } from '../../api/technical-records.api';
import type { AdrDetails } from '../../builders/helpers/adr';
import { HgvBuilder } from '../../builders/vehicle/hgv.builder';
import { LgvBuilder } from '../../builders/vehicle/lgv.builder';
import { TrlBuilder } from '../../builders/vehicle/trl.builder';
import type { DateInput } from '../../components/date-input.component';
import { expect, test } from '../../fixtures/api.fixture';
import { PageFactory } from '../../page-objects/page.factory';
import type { AdrSection } from '../../page-objects/technical-record/sections/adr.section';
import { amendAdrDetails } from '../../workflows/technical-record/amend-adr-details.workflow';
import { openTechnicalRecord } from '../../workflows/technical-record/open-technical-record.workflow';

async function expectDate(field: DateInput, value: string | null | undefined): Promise<void> {
	if (!value) throw new Error('Expected an ADR date in the test data.');
	const [year, month, day] = value.split('-');
	await expect(field.day.locator).toHaveValue(String(Number(day)));
	await expect(field.month.locator).toHaveValue(String(Number(month)));
	await expect(field.year.locator).toHaveValue(year);
}

async function amendAndReload(
	pages: PageFactory,
	record: CreatedTechnicalRecord,
	details: AdrDetails & { techRecord_vehicleType: 'hgv' | 'lgv' | 'trl' }
): Promise<AdrSection> {
	expect(
		isValidObject(
			`v3/tech-record/put/${details.techRecord_vehicleType}/complete/index.json`,
			structuredClone(details),
			true
		)
	).toEqual([]);
	await openTechnicalRecord(pages, record);
	await pages.viewTechnicalRecordPage.clearFilters();
	await pages.viewTechnicalRecordPage.adr.open();
	await expect.poll(pages.viewTechnicalRecordPage.adr.fields.techRecord_adrDetails_dangerousGoods.value).toBe('false');
	await amendAdrDetails(pages, details, 'Add ADR details for inspection');
	await pages.page.reload();
	const view = pages.viewTechnicalRecordPage;
	await expect(view.heading).toBeVisible();
	await expect(view.vin).toHaveText(record.vin);
	await expect(view.statusCode).toHaveText('Current');
	await expect(view.recordCompleteness).toHaveText('complete');
	await view.clearFilters();
	await view.adr.open();
	return view.adr;
}

async function expectApplicationDetails(adr: AdrSection, details: AdrDetails): Promise<void> {
	const fields = adr.fields;
	const receivedDate = dayjs(details.techRecord_adrDetails_receivedDate);
	expect(receivedDate.isAfter(dayjs().subtract(6, 'month').startOf('day'))).toBe(true);
	expect(receivedDate.isAfter(dayjs().endOf('day'))).toBe(false);
	await expect.poll(fields.techRecord_adrDetails_dangerousGoods.value).toBe('true');
	await expectDate(fields.techRecord_adrDetails_receivedDate, details.techRecord_adrDetails_receivedDate);
	await expectDate(
		fields.techRecord_adrDetails_vehicleDetails_approvalDate,
		details.techRecord_adrDetails_vehicleDetails_approvalDate
	);
	for (const [field, value] of [
		[fields.techRecord_adrDetails_applicationNumber, details.techRecord_adrDetails_applicationNumber],
		[fields.techRecord_adrDetails_applicantDetails_name, details.techRecord_adrDetails_applicantDetails_name],
		[fields.techRecord_adrDetails_applicantDetails_street, details.techRecord_adrDetails_applicantDetails_street],
		[fields.techRecord_adrDetails_applicantDetails_town, details.techRecord_adrDetails_applicantDetails_town],
		[fields.techRecord_adrDetails_applicantDetails_city, details.techRecord_adrDetails_applicantDetails_city],
		[fields.techRecord_adrDetails_applicantDetails_postcode, details.techRecord_adrDetails_applicantDetails_postcode],
		[fields.techRecord_adrDetails_vehicleDetails_type, details.techRecord_adrDetails_vehicleDetails_type],
	] as const) {
		await expect.poll(field.value).toBe(value);
	}
	await expect
		.poll(fields.techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys.value)
		.toBe(details.techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys);
	await expect
		.poll(fields.techRecord_adrDetails_permittedDangerousGoods.value)
		.toEqual(details.techRecord_adrDetails_permittedDangerousGoods);
	await expect
		.poll(fields.techRecord_adrDetails_additionalNotes_number.value)
		.toEqual(details.techRecord_adrDetails_additionalNotes_number);
	await expect(fields.techRecord_adrDetails_approved.locator).toBeChecked();
}

async function expectTankDetails(adr: AdrSection, details: AdrDetails): Promise<void> {
	const fields = adr.fields;
	for (const [field, value] of [
		[
			fields.techRecord_adrDetails_tank_tankDetails_tankManufacturer,
			details.techRecord_adrDetails_tank_tankDetails_tankManufacturer,
		],
		[
			fields.techRecord_adrDetails_tank_tankDetails_yearOfManufacture,
			details.techRecord_adrDetails_tank_tankDetails_yearOfManufacture,
		],
		[
			fields.techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo,
			details.techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo,
		],
		[
			fields.techRecord_adrDetails_tank_tankDetails_tankTypeAppNo,
			details.techRecord_adrDetails_tank_tankDetails_tankTypeAppNo,
		],
		[fields.techRecord_adrDetails_tank_tankDetails_tankCode, details.techRecord_adrDetails_tank_tankDetails_tankCode],
		[
			fields.techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo,
			details.techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo,
		],
		[
			fields.techRecord_adrDetails_tank_tankDetails_specialProvisions,
			details.techRecord_adrDetails_tank_tankDetails_specialProvisions,
		],
	] as const) {
		await expect.poll(field.value).toBe(String(value));
	}
	await expect
		.poll(fields.techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted.value)
		.toBe(details.techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted);
	await expect
		.poll(fields.techRecord_adrDetails_tank_tankDetails_tankStatement_select.value)
		.toBe(details.techRecord_adrDetails_tank_tankDetails_tankStatement_select);
	await expectDate(
		fields.techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate,
		details.techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate
	);
	await expect(fields.techRecord_adrDetails_bodyDeclaration_type.locator).toBeHidden();
	await expect(fields.techRecord_adrDetails_compatibilityGroupJ.locator).toBeHidden();
}

test.describe('Amend technical record ADR details', { tag: ['@regression', '@technical-record', '@adr'] }, () => {
	test.describe.configure({ timeout: 120_000 });

	test('adds LGV ADR details with explosives, compatibility group J and a body declaration', async ({
		page,
		technicalRecordsApi,
	}) => {
		const pages = new PageFactory(page);
		const base = new LgvBuilder().current().complete().withVrm().build({ techRecord_adrDetails_dangerousGoods: false });
		const record = await technicalRecordsApi.create(base);
		const details = new LgvBuilder(base).withAdrDetails().withExplosives().withOperatorDeclaration().build();
		const adr = await amendAndReload(pages, record, details);
		await expectApplicationDetails(adr, details);
		await expect
			.poll(adr.fields.techRecord_adrDetails_bodyDeclaration_type.value)
			.toBe(details.techRecord_adrDetails_bodyDeclaration_type);
		await expect
			.poll(adr.fields.techRecord_adrDetails_compatibilityGroupJ.value)
			.toBe(details.techRecord_adrDetails_compatibilityGroupJ);
		await expect(adr.fields.techRecord_adrDetails_declarationsSeen.locator).toBeChecked();
		await expect(adr.fields.techRecord_adrDetails_tank_tankDetails_tankManufacturer.locator).toBeHidden();
		await expect(adr.fields.techRecord_adrDetails_listStatementApplicable.locator).toBeHidden();
	});

	test('adds HGV ADR tank details with a product reference, multiple UN numbers and brake declarations', async ({
		page,
		technicalRecordsApi,
	}) => {
		const pages = new PageFactory(page);
		const base = new HgvBuilder().current().complete().withVrm().build({ techRecord_adrDetails_dangerousGoods: false });
		const record = await technicalRecordsApi.create(base);
		const inspections = [
			{
				tc3Type: TC3Types.INTERMEDIATE,
				tc3PeriodicNumber: 'TC3-12345',
				tc3PeriodicExpiryDate: dayjs().add(2, 'year').format('YYYY-MM-DD'),
			},
			{
				tc3Type: TC3Types.PERIODIC,
				tc3PeriodicNumber: 'TC3-67890',
				tc3PeriodicExpiryDate: dayjs().add(3, 'year').format('YYYY-MM-DD'),
			},
		];
		const details = new HgvBuilder(base)
			.withAdrDetails()
			.withTankDetails({
				techRecord_adrDetails_brakeDeclarationsSeen: true,
				techRecord_adrDetails_brakeDeclarationIssuer: 'Test Brake Manufacturer',
				techRecord_adrDetails_brakeEndurance: true,
				techRecord_adrDetails_weight: 18.5,
				techRecord_adrDetails_tank_tankDetails_tc3Details: inspections,
			})
			.build();
		const adr = await amendAndReload(pages, record, details);
		await expectApplicationDetails(adr, details);
		await expectTankDetails(adr, details);
		await expect
			.poll(adr.fields.techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo.value)
			.toBe(details.techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo);
		await expect(adr.unNumberInputs).toHaveCount(2);
		await expect(adr.unNumberInputs.nth(0)).toHaveValue('1202');
		await expect(adr.unNumberInputs.nth(1)).toHaveValue('1203');
		await expect
			.poll(adr.fields.techRecord_adrDetails_tank_tankDetails_tankStatement_productList.value)
			.toBe(details.techRecord_adrDetails_tank_tankDetails_tankStatement_productList);
		await expect(adr.fields.techRecord_adrDetails_tank_tankDetails_tankStatement_statement.locator).toBeHidden();
		await expect(adr.fields.techRecord_adrDetails_brakeDeclarationsSeen.locator).toBeChecked();
		await expect.poll(adr.fields.techRecord_adrDetails_brakeDeclarationIssuer.value).toBe('Test Brake Manufacturer');
		await expect(adr.fields.techRecord_adrDetails_brakeEndurance.locator).toBeChecked();
		await expect.poll(adr.fields.techRecord_adrDetails_weight.value).toBe('18.5');
		await expect(adr.subsequentInspectionTypes).toHaveCount(2);
		for (const [index, inspection] of inspections.entries()) {
			const fields = adr.subsequentInspection(index);
			await expect.poll(fields.tc3Type.value).toBe(inspection.tc3Type);
			await expect(fields.tc3PeriodicNumber.locator).toHaveValue(inspection.tc3PeriodicNumber);
			await expectDate(fields.tc3PeriodicExpiryDate, inspection.tc3PeriodicExpiryDate);
		}
	});

	test('adds trailer ADR battery details with a statement reference and battery list', async ({
		page,
		technicalRecordsApi,
	}) => {
		const pages = new PageFactory(page);
		const base = new TrlBuilder()
			.current()
			.complete()
			.withTrailerId()
			.build({ techRecord_adrDetails_dangerousGoods: false });
		const record = await technicalRecordsApi.create(base);
		const details = new TrlBuilder(base).withAdrDetails().withBatteryDetails().withOperatorDeclaration().build();
		const adr = await amendAndReload(pages, record, details);
		await expectApplicationDetails(adr, details);
		await expectTankDetails(adr, details);
		await expect
			.poll(adr.fields.techRecord_adrDetails_tank_tankDetails_tankStatement_statement.value)
			.toBe(details.techRecord_adrDetails_tank_tankDetails_tankStatement_statement);
		await expect.poll(adr.fields.techRecord_adrDetails_listStatementApplicable.value).toBe('true');
		await expect
			.poll(adr.fields.techRecord_adrDetails_batteryListNumber.value)
			.toBe(details.techRecord_adrDetails_batteryListNumber);
		await expect(adr.fields.techRecord_adrDetails_declarationsSeen.locator).toBeChecked();
		await expect(adr.fields.techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo.locator).toBeHidden();
		await expect(adr.unNumberInputs).toHaveCount(0);
	});
});
