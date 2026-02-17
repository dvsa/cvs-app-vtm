import { SelectComponent } from '@/e2e/components/select.component';
import { TextInputComponent } from '@/e2e/components/text-input.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';

export class ApprovalTypeSection extends BasePage {
	readonly approvalTypeSelect = new SelectComponent(this.page, 'techRecord_approvalType');
	// @TODO: hard code id for now, replace with bespoke component
	readonly approvalTypeNumberTextInput = new TextInputComponent(this.page, 'techRecord_approvalTypeNumber1-NTA');
	readonly nationalTypeNumberTextInput = new TextInputComponent(this.page, 'techRecord_ntaNumber');
	readonly coifSerialNumberTextInput = new TextInputComponent(this.page, 'techRecord_coifSerialNumber');
	readonly coifCertifierNameTextInput = new TextInputComponent(this.page, 'techRecord_coifCertifierName');
	readonly coifCertifierDateInput = new TextInputComponent(this.page, 'techRecord_coifDate');
	readonly variantNumberTextInput = new TextInputComponent(this.page, 'techRecord_variantNumber');
	readonly variantVersionNumberTextInput = new TextInputComponent(this.page, 'techRecord_variantVersionNumber');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		if (data.techRecord_vehicleType === 'hgv') {
			await this.approvalTypeSelect.fill(data.techRecord_approvalType);
			await this.approvalTypeNumberTextInput.fill(data.techRecord_approvalTypeNumber);
			await this.nationalTypeNumberTextInput.fill(data.techRecord_ntaNumber);
			await this.variantNumberTextInput.fill(data.techRecord_variantNumber);
			await this.variantVersionNumberTextInput.fill(data.techRecord_variantVersionNumber);
		}

		if (data.techRecord_vehicleType === 'trl') {
			await this.approvalTypeSelect.fill(data.techRecord_approvalType);
			await this.approvalTypeNumberTextInput.fill(data.techRecord_approvalTypeNumber);
			await this.nationalTypeNumberTextInput.fill(data.techRecord_ntaNumber);
			await this.variantNumberTextInput.fill(data.techRecord_variantNumber);
			await this.variantVersionNumberTextInput.fill(data.techRecord_variantVersionNumber);
		}

		if (data.techRecord_vehicleType === 'psv') {
			await this.approvalTypeSelect.fill(data.techRecord_approvalType);
			await this.approvalTypeNumberTextInput.fill(data.techRecord_approvalTypeNumber);
			await this.coifSerialNumberTextInput.fill(data.techRecord_coifSerialNumber);
			await this.coifCertifierNameTextInput.fill(data.techRecord_coifCertifierName);
			await this.coifCertifierDateInput.fill(data.techRecord_coifDate);
			await this.variantNumberTextInput.fill(data.techRecord_variantNumber);
			await this.variantVersionNumberTextInput.fill(data.techRecord_variantVersionNumber);
		}
	}
}
