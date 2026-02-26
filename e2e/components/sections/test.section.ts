import { BasePage } from '@/e2e/pages/base.page';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { DateInputComponent } from '../date-input.component';
import { RadiosComponent } from '../radios.component';
import { TextInputComponent } from '../text-input.component';

export class TestSection extends BasePage {
	readonly contingencyTestNumberTextInput = new TextInputComponent(this.page, 'contingencyTestNumber');
	readonly resultRadios = new RadiosComponent(this.page, 'result');
	readonly issueDocumentsCentrallyRadios = new RadiosComponent(this.page, 'issueDocumentsCentrally');
	readonly descriptionTextInput = new TextInputComponent(this.page, 'description');
	readonly certificateNumberTextInput = new TextInputComponent(this.page, 'certificateNumber');
	readonly expiryDateDateInput = new DateInputComponent(this.page, 'expiryDate');
	readonly testStartDateAndTimeDateInput = new DateInputComponent(this.page, 'testStartDateAndTime');
	readonly testEndDateAndTimeDateInput = new DateInputComponent(this.page, 'testEndDateAndTime');
	readonly prohibitionIssuedRadios = new RadiosComponent(this.page, 'prohibitionIssued');
	readonly reapplicationDateDateInput = new DateInputComponent(this.page, 'reapplicationDate');
	readonly generateCertificateButton = this.page.getByRole('button', { name: 'Generate certificate' });

	async fill(data: Partial<TestResultSchema>): Promise<void> {}
}
