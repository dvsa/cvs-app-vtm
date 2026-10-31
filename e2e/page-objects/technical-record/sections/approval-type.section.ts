import { Locator, Page } from '@playwright/test';
import { DateInput } from '../../../components/date-input.component';
import { Input } from '../../../components/input.component';
import { Select } from '../../../components/select.component';
import { Section, SectionValues, fillFields } from './section';

export class ApprovalTypeSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'approval-type');
	}

	readonly fields = {
		techRecord_approvalType: new Select(this.content, 'techRecord_approvalType'),
		techRecord_ntaNumber: new Input(this.content, 'techRecord_ntaNumber'),
		techRecord_coifSerialNumber: new Input(this.content, 'techRecord_coifSerialNumber'),
		techRecord_coifCertifierName: new Input(this.content, 'techRecord_coifCertifierName'),
		techRecord_coifDate: new DateInput(this.content, 'techRecord_coifDate'),
		techRecord_variantNumber: new Input(this.content, 'techRecord_variantNumber'),
		techRecord_variantVersionNumber: new Input(this.content, 'techRecord_variantVersionNumber'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
