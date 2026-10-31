import { Locator, Page } from '@playwright/test';
import { DateInput } from '../../../components/date-input.component';
import { Section, SectionValues, fillFields } from './section';

export class AuthorisationIntoServiceSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'authorisation-into-service');
	}

	readonly fields = {
		techRecord_authIntoService_cocIssueDate: new DateInput(this.content, 'techRecord_authIntoService_cocIssueDate'),
		techRecord_authIntoService_dateReceived: new DateInput(this.content, 'techRecord_authIntoService_dateReceived'),
		techRecord_authIntoService_datePending: new DateInput(this.content, 'techRecord_authIntoService_datePending'),
		techRecord_authIntoService_dateAuthorised: new DateInput(this.content, 'techRecord_authIntoService_dateAuthorised'),
		techRecord_authIntoService_dateRejected: new DateInput(this.content, 'techRecord_authIntoService_dateRejected'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
