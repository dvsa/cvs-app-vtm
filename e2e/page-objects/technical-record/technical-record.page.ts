import type { TechRecordPUTMotorcycleSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/motorcycle/skeleton';
import type { TechRecordPUTSmallTRLComplete } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/small trl/complete';
import type { TechRecordPUTSmallTRLSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/small trl/skeleton';
import type { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { AccordionGroup } from '../../components/accordion-group.component';
import { BasePage } from '../base.page';
import { AdrSection } from './sections/adr.section';
import { ApprovalTypeSection } from './sections/approval-type.section';
import { AuthorisationIntoServiceSection } from './sections/authorisation-into-service.section';
import { BrakesSection } from './sections/brakes.section';
import { ConfigurationSection } from './sections/configuration.section';
import { DdaSection } from './sections/dda.section';
import { DimensionsSection } from './sections/dimensions.section';
import { DocumentsSection } from './sections/documents.section';
import { EmissionsAndExemptionsSection } from './sections/emissions-and-exemptions.section';
import { GeneralVehicleDetailsSection } from './sections/general-vehicle-details.section';
import { LastApplicantSection } from './sections/last-applicant.section';
import { ManufacturerSection } from './sections/manufacturer.section';
import { NotesSection } from './sections/notes.section';
import { PurchasersSection } from './sections/purchasers.section';
import { ReasonForCreationSection } from './sections/reason-for-creation.section';
import { SeatsAndVehicleSizeSection } from './sections/seats-and-vehicle-size.section';
import { TyresSection } from './sections/tyres.section';
import { WeightsSection } from './sections/weights.section';

export type TechnicalRecord =
	| TechRecordType<'put'>
	| TechRecordPUTMotorcycleSkeleton
	| TechRecordPUTSmallTRLSkeleton
	| TechRecordPUTSmallTRLComplete;

export abstract class TechnicalRecordPage extends BasePage {
	async fill(record: Partial<TechnicalRecord>): Promise<void> {
		await this.clearFilters();
		const vehicleType = record.techRecord_vehicleType;
		const smallTrailer =
			vehicleType === 'trl' &&
			(record.techRecord_euVehicleCategory === 'o1' || record.techRecord_euVehicleCategory === 'o2');
		const heavy = vehicleType === 'hgv' || vehicleType === 'psv' || (vehicleType === 'trl' && !smallTrailer);

		await this.generalVehicleDetails.fillFromRecord(record, [
			...(vehicleType === 'psv'
				? [
						'techRecord_bodyMake',
						'techRecord_chassisMake',
						'techRecord_chassisModel',
						'techRecord_bodyType_description',
						'techRecord_vehicleClass_description',
					]
				: [
						'techRecord_brakes_dtpNumber',
						'techRecord_bodyMake',
						'techRecord_bodyModel',
						'techRecord_chassisMake',
						'techRecord_chassisModel',
					]),
			...(vehicleType !== 'motorcycle' ? ['techRecord_vehicleClass_description'] : []),
			...(vehicleType === 'car' || vehicleType === 'lgv' || vehicleType === 'motorcycle'
				? ['techRecord_vehicleConfiguration']
				: []),
		]);
		await this.generalVehicleDetails.open();
		await this.generalVehicleDetails.numberOfAxlesConfirmButton.click();

		if (vehicleType === 'psv') {
			await this.seatsAndVehicleSize.fillFromRecord(record);
			await this.dda.fillFromRecord(record);
		}
		if (heavy) {
			await this.approvalType.fillFromRecord(record);
			await this.configuration.fillFromRecord(record);
			await this.emissionsAndExemptions.fillFromRecord(record);
			await this.dimensions.fillFromRecord(record);
			if ('techRecord_axles' in record && record.techRecord_axles) {
				await this.tyres.fillTyreCodes(
					record.techRecord_axles.map((axle) => ('tyres_tyreCode' in axle ? axle.tyres_tyreCode : undefined))
				);
				await this.tyres.fillFromRecord({
					...record,
					techRecord_axles: record.techRecord_axles.map((axle) => ({
						tyres_fitmentCode: 'tyres_fitmentCode' in axle ? axle.tyres_fitmentCode : undefined,
						tyres_speedCategorySymbol: 'tyres_speedCategorySymbol' in axle ? axle.tyres_speedCategorySymbol : undefined,
					})),
				});
			} else {
				await this.tyres.fillFromRecord(record);
			}
			await this.weights.fillFromRecord(record, vehicleType === 'psv' ? ['techRecord_brakes_dtpNumber'] : []);
			await this.brakes.fillFromRecord(
				{
					...record,
					...(vehicleType === 'psv' && record.techRecord_brakes_brakeCode
						? { techRecord_brakes_brakeCodeOriginal: record.techRecord_brakes_brakeCode.slice(-3) }
						: {}),
				},
				['techRecord_brakes_dataTrBrakeOne', 'techRecord_brakes_dataTrBrakeTwo', 'techRecord_brakes_dataTrBrakeThree']
			);
			await this.lastApplicant.fillFromRecord(record);
			await this.documents.fillFromRecord(record);
		}
		if (vehicleType === 'trl' && !smallTrailer) {
			await this.authorisationIntoService.fillFromRecord(record);
			await this.manufacturer.fillFromRecord(record);
			await this.purchasers.fillFromRecord(record);
		}
		if (vehicleType === 'hgv' || vehicleType === 'lgv' || vehicleType === 'trl') {
			await this.adr.fillFromRecord(record);
		}
		await this.notes.fillFromRecord(record);
		await this.reasonForCreation.fillFromRecord(record);
	}

	async clearFilters(): Promise<void> {
		const activeFilters = this.page.locator('app-tech-record-filters a.active-filter');
		while (await activeFilters.count()) await activeFilters.first().click();
	}

	readonly accordions = new AccordionGroup(this.page, 'accordian-show-all-button');
	readonly generalVehicleDetails = new GeneralVehicleDetailsSection(this.page);
	readonly approvalType = new ApprovalTypeSection(this.page);
	readonly authorisationIntoService = new AuthorisationIntoServiceSection(this.page);
	readonly dimensions = new DimensionsSection(this.page);
	readonly weights = new WeightsSection(this.page);
	readonly tyres = new TyresSection(this.page);
	readonly configuration = new ConfigurationSection(this.page);
	readonly emissionsAndExemptions = new EmissionsAndExemptionsSection(this.page);
	readonly seatsAndVehicleSize = new SeatsAndVehicleSizeSection(this.page);
	readonly dda = new DdaSection(this.page);
	readonly brakes = new BrakesSection(this.page);
	readonly adr = new AdrSection(this.page);
	readonly lastApplicant = new LastApplicantSection(this.page);
	readonly purchasers = new PurchasersSection(this.page);
	readonly manufacturer = new ManufacturerSection(this.page);
	readonly documents = new DocumentsSection(this.page);
	readonly notes = new NotesSection(this.page);
	readonly reasonForCreation = new ReasonForCreationSection(this.page);
}
