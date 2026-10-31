import { Locator, Page } from '@playwright/test';
import { Input } from '../../../components/input.component';
import { Section, SectionValues, fillFields } from './section';

export class LastApplicantSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'last-applicant');
	}

	readonly fields = {
		techRecord_applicantDetails_name: new Input(this.content, 'techRecord_applicantDetails_name'),
		techRecord_applicantDetails_address1: new Input(this.content, 'techRecord_applicantDetails_address1'),
		techRecord_applicantDetails_address2: new Input(this.content, 'techRecord_applicantDetails_address2'),
		techRecord_applicantDetails_postTown: new Input(this.content, 'techRecord_applicantDetails_postTown'),
		techRecord_applicantDetails_address3: new Input(this.content, 'techRecord_applicantDetails_address3'),
		techRecord_applicantDetails_postCode: new Input(this.content, 'techRecord_applicantDetails_postCode'),
		techRecord_applicantDetails_telephoneNumber: new Input(this.content, 'techRecord_applicantDetails_telephoneNumber'),
		techRecord_applicantDetails_emailAddress: new Input(this.content, 'techRecord_applicantDetails_emailAddress'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
