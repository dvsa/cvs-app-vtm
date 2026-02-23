import { AccordionsComponent } from '@/e2e/components/accordions.component';
import { AdrCertficatesSection } from '@/e2e/components/sections/adr-certificates.section';
import { AdrSection } from '@/e2e/components/sections/adr.section';
import { ApprovalTypeSection } from '@/e2e/components/sections/approval-type.section';
import { AuthorisationIntoServiceSection } from '@/e2e/components/sections/authorisation-into-service.section';
import { BrakesSection } from '@/e2e/components/sections/brakes.section';
import { ConfigurationSection } from '@/e2e/components/sections/configuration.section';
import { DimensionsSection } from '@/e2e/components/sections/dimensions.section';
import { DisabilityDiscriminationActSection } from '@/e2e/components/sections/disability-discrimination-act.section';
import { DocumentsSection } from '@/e2e/components/sections/documents.section';
import { EmissionsAndExemptionsSection } from '@/e2e/components/sections/emissions-and-exemptions.section';
import { FiltersSection } from '@/e2e/components/sections/filters.section';
import { GeneralVehicleDetailsSection } from '@/e2e/components/sections/general-vehicle-details.section';
import { LastApplicantSection } from '@/e2e/components/sections/last-applicant.section';
import { ManufacturerSection } from '@/e2e/components/sections/manufacturer.section';
import { NotesSection } from '@/e2e/components/sections/notes.section';
import { PlatesSection } from '@/e2e/components/sections/plates.section';
import { PurchasersSection } from '@/e2e/components/sections/purchasers.section';
import { ReasonForCreationSection } from '@/e2e/components/sections/reason-for-creation.section';
import { SeatsAndVehicleSizeSection } from '@/e2e/components/sections/seats-and-vehicle-size.section';
import { SummarySection } from '@/e2e/components/sections/summary.section';
import { TechnicalRecordsHistorySection } from '@/e2e/components/sections/technical-records-history.section';
import { TestRecordsSection } from '@/e2e/components/sections/test-records.section';
import { TyresSection } from '@/e2e/components/sections/tyres.section';
import { WeightsSection } from '@/e2e/components/sections/weights.section';
import { BasePage } from '../base.page';

export class ViewTechRecordPage extends BasePage {
	readonly accordions = new AccordionsComponent(this.page);
	readonly adrCertificatesSection = new AdrCertficatesSection(this.page);
	readonly adrSection = new AdrSection(this.page);
	readonly approvalTypeSection = new ApprovalTypeSection(this.page);
	readonly authorisationIntoServiceSection = new AuthorisationIntoServiceSection(this.page);
	readonly brakesSection = new BrakesSection(this.page);
	readonly configurationSection = new ConfigurationSection(this.page);
	readonly dimensionsSection = new DimensionsSection(this.page);
	readonly disibilityDiscriminationActSection = new DisabilityDiscriminationActSection(this.page);
	readonly documentsSection = new DocumentsSection(this.page);
	readonly emissionsAndExemptionsSection = new EmissionsAndExemptionsSection(this.page);
	readonly filtersSection = new FiltersSection(this.page);
	readonly generalVehicleDetailsSection = new GeneralVehicleDetailsSection(this.page);
	readonly lastApplicantSection = new LastApplicantSection(this.page);
	readonly manufacturerSection = new ManufacturerSection(this.page);
	readonly notesSection = new NotesSection(this.page);
	readonly platesSection = new PlatesSection(this.page);
	readonly purchasersSection = new PurchasersSection(this.page);
	readonly reasonForCreationSection = new ReasonForCreationSection(this.page);
	readonly seatsAndVehicleSizeSection = new SeatsAndVehicleSizeSection(this.page);
	readonly summarySection = new SummarySection(this.page);
	readonly technicalRecordsHistorySection = new TechnicalRecordsHistorySection(this.page);
	readonly testRecordsSection = new TestRecordsSection(this.page);
	readonly tyresSection = new TyresSection(this.page);
	readonly weightsSection = new WeightsSection(this.page);
	readonly amendRecordButton = this.page.getByRole('button', {
		name: 'Amend record',
	});
}
