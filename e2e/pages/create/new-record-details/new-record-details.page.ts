import { AccordionsComponent } from '@/e2e/components/accordions.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';
import { AdrSection } from './adr.section';
import { ApprovalTypeSection } from './approval-type.section';
import { AuthorisationIntoServiceSection } from './authorisation-into-service.section';
import { BrakesSection } from './brakes.section';
import { ConfigurationSection } from './configuration.section';
import { DimensionsSection } from './dimensions.section';
import { DisabilityDiscriminationActSection } from './disability-discrimination-act.section';
import { DocumentsSection } from './documents.section';
import { EmissionsAndExemptionsSection } from './emissions-and-exemptions.section';
import { GeneralVehicleDetailsSection } from './general-vehicle-details.section';
import { LastApplicantSection } from './last-applicant.section';
import { ManufacturerSection } from './manufacturer.section';
import { NotesSection } from './notes.section';
import { PurchasersSection } from './purchasers.section';
import { ReasonForCreationSection } from './reason-for-creation.section';
import { SeatsAndVehicleSizeSection } from './seats-and-vehicle-size.section';
import { TyresSection } from './tyres.section';
import { WeightsSection } from './weights.section';

export class NewRecordDetailsPage extends BasePage {
	readonly accordions = new AccordionsComponent(this.page);
	readonly generalVehicleDetailsSection = new GeneralVehicleDetailsSection(this.page);
	readonly approvalTypeSection = new ApprovalTypeSection(this.page);
	readonly dimensionsSection = new DimensionsSection(this.page);
	readonly weightsSection = new WeightsSection(this.page);
	readonly tyresSection = new TyresSection(this.page);
	readonly configurationSection = new ConfigurationSection(this.page);
	readonly brakesSection = new BrakesSection(this.page);
	readonly disabilityDiscriminationActSection = new DisabilityDiscriminationActSection(this.page);
	readonly emissionsAndExemptionsSection = new EmissionsAndExemptionsSection(this.page);
	readonly seatsAndVehicleSizeSection = new SeatsAndVehicleSizeSection(this.page);
	readonly adrSection = new AdrSection(this.page);
	readonly authorisationIntoServiceSection = new AuthorisationIntoServiceSection(this.page);
	readonly purchasersSection = new PurchasersSection(this.page);
	readonly manufacturerSection = new ManufacturerSection(this.page);
	readonly lastApplicantSection = new LastApplicantSection(this.page);
	readonly documentsSection = new DocumentsSection(this.page);
	readonly notesSection = new NotesSection(this.page);
	readonly reasonForCreationSection = new ReasonForCreationSection(this.page);
	readonly createNewTechRecordButton = this.page.getByRole('button', { name: 'Create new record' });

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		await this.accordions.open();

		// @TODO: handle other vehicle types

		if (data.techRecord_vehicleType === 'hgv') {
			await this.generalVehicleDetailsSection.fill(data);
			await this.approvalTypeSection.fill(data);
			await this.dimensionsSection.fill(data);
			await this.weightsSection.fill(data);
			await this.tyresSection.fill(data);
			await this.configurationSection.fill(data);
			await this.emissionsAndExemptionsSection.fill(data);
			await this.adrSection.fill(data);
			await this.lastApplicantSection.fill(data);
			await this.documentsSection.fill(data);
			await this.notesSection.fill(data);
			await this.reasonForCreationSection.fill(data);
		}

		if (data.techRecord_vehicleType === 'trl') {
			await this.generalVehicleDetailsSection.fill(data);
			await this.approvalTypeSection.fill(data);
			await this.dimensionsSection.fill(data);
			await this.weightsSection.fill(data);
			await this.tyresSection.fill(data);
			await this.configurationSection.fill(data);
			await this.brakesSection.fill(data);
			await this.adrSection.fill(data);
			await this.authorisationIntoServiceSection.fill(data);
			await this.purchasersSection.fill(data);
			await this.manufacturerSection.fill(data);
			await this.lastApplicantSection.fill(data);
			await this.documentsSection.fill(data);
			await this.notesSection.fill(data);
			await this.reasonForCreationSection.fill(data);
		}

		if (data.techRecord_vehicleType === 'psv') {
			await this.generalVehicleDetailsSection.fill(data);
			await this.approvalTypeSection.fill(data);
			await this.dimensionsSection.fill(data);
			await this.weightsSection.fill(data);
			await this.tyresSection.fill(data);
			await this.configurationSection.fill(data);
			await this.emissionsAndExemptionsSection.fill(data);
			await this.seatsAndVehicleSizeSection.fill(data);
			await this.brakesSection.fill(data);
			await this.disabilityDiscriminationActSection.fill(data);
			await this.documentsSection.fill(data);
			await this.notesSection.fill(data);
			await this.reasonForCreationSection.fill(data);
		}
	}

	async submit(): Promise<void> {
		await this.createNewTechRecordButton.click();
	}
}
