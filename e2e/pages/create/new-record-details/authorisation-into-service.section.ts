import { DateInputComponent } from '@/e2e/components/date-input.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';

export class AuthorisationIntoServiceSection extends BasePage {
	readonly cocIssueDateDateInput = new DateInputComponent(this.page, 'techRecord_authIntoService_cocIssueDate');
	readonly dateReceivedDateInput = new DateInputComponent(this.page, 'techRecord_authIntoService_dateReceived');
	readonly datePendingDateInput = new DateInputComponent(this.page, 'techRecord_authIntoService_datePending');
	readonly dateAuthorisedDateInput = new DateInputComponent(this.page, 'techRecord_authIntoService_dateAuthorised');
	readonly dateRejectedDateInput = new DateInputComponent(this.page, 'techRecord_authIntoService_dateRejected');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		if (data.techRecord_vehicleType !== 'trl') return;
		await this.cocIssueDateDateInput.fill(data.techRecord_authIntoService_cocIssueDate);
		await this.dateReceivedDateInput.fill(data.techRecord_authIntoService_dateReceived);
		await this.datePendingDateInput.fill(data.techRecord_authIntoService_datePending);
		await this.dateAuthorisedDateInput.fill(data.techRecord_authIntoService_dateAuthorised);
		await this.dateRejectedDateInput.fill(data.techRecord_authIntoService_dateRejected);
	}
}
