import { AccordionsComponent } from '@/e2e/components/accordions.component';
import { AdditionalDefectsSection } from '@/e2e/components/sections/additional-defects.section';
import { AdditionalNotesSection } from '@/e2e/components/sections/additional-notes.section';
import { CustomDefectsSection } from '@/e2e/components/sections/custom-defects.section';
import { DefectsSection } from '@/e2e/components/sections/defects.section';
import { EmissionsSection } from '@/e2e/components/sections/emissions.section';
import { RequiredStandardsSection } from '@/e2e/components/sections/required-standards.section';
import { SeatbeltsSection } from '@/e2e/components/sections/seatbelts.section';
import { TestSection } from '@/e2e/components/sections/test.section';
import { VehicleDetailsSection } from '@/e2e/components/sections/vehicle-details.section';
import { VisitSection } from '@/e2e/components/sections/visit.section';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { BasePage } from '../base.page';

export class CreateTestResultPage extends BasePage {
	readonly accordions = new AccordionsComponent(this.page);
	readonly vehicleDetailsSection = new VehicleDetailsSection(this.page);
	readonly testSection = new TestSection(this.page);
	readonly seatbeltsSection = new SeatbeltsSection(this.page);
	readonly emissionsSection = new EmissionsSection(this.page);
	readonly visitSection = new VisitSection(this.page);
	readonly additionalNotesSection = new AdditionalNotesSection(this.page);
	readonly defectsSection = new DefectsSection(this.page);
	readonly requiredStandardsSection = new RequiredStandardsSection(this.page);
	readonly customDefectsSection = new CustomDefectsSection(this.page);
	readonly additionalDefectsSection = new AdditionalDefectsSection(this.page);
	readonly reviewButton = this.page.getByRole('button', { name: 'Review' });
	readonly markAsAbandonedButton = this.page.getByRole('button', { name: 'Mark as abandoned' });

	async fill(data: Partial<TestResultSchema>): Promise<void> {
		await this.accordions.open();
		await this.vehicleDetailsSection.fill(data);
		await this.testSection.fill(data);
		await this.seatbeltsSection.fill(data);
		await this.emissionsSection.fill(data);
		await this.visitSection.fill(data);
		await this.additionalNotesSection.fill(data);
		await this.defectsSection.fill(data);
		await this.requiredStandardsSection.fill(data);
		await this.customDefectsSection.fill(data);
		await this.additionalDefectsSection.fill(data);
	}

	async submit(): Promise<void> {
		await this.reviewButton.click();
	}
}
