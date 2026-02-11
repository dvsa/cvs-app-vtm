import { SelectComponent } from '@/e2e/components/select.component';
import { TextInputComponent } from '@/e2e/components/text-input.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';

export class ApprovalTypeSection extends BasePage {
	readonly approvalTypeSelect = new SelectComponent(this.page, 'techRecord_approvalType');
	// @TODO: hard code id for now, replace with bespoke component
	readonly approvalTypeNumberTextInput = new TextInputComponent(this.page, 'techRecord_approvalTypeNumber1-NTA');
	readonly nationalTypeNumberTextInput = new TextInputComponent(this.page, 'techRecord_ntaNumber');
	readonly variantNumberTextInput = new TextInputComponent(this.page, 'techRecord_variantNumber');
	readonly variantVersionNumberTextInput = new TextInputComponent(this.page, 'techRecord_variantVersionNumber');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		// @TODO: handle other vehicle types
		if (data.techRecord_vehicleType === 'hgv') {
			await this.approvalTypeSelect.fill(data.techRecord_approvalType);
			await this.approvalTypeNumberTextInput.fill(data.techRecord_approvalTypeNumber);
			await this.nationalTypeNumberTextInput.fill(data.techRecord_ntaNumber);
			await this.variantNumberTextInput.fill(data.techRecord_variantNumber);
			await this.variantVersionNumberTextInput.fill(data.techRecord_variantVersionNumber);
		}
	}
}
