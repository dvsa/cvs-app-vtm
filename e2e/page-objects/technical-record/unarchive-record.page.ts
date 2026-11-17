import { Button } from '../../components/button.component';
import { Radios } from '../../components/radios.component';
import { Textarea } from '../../components/textarea.component';
import { BasePage } from '../base.page';

export class UnarchiveRecordPage extends BasePage {
	readonly status = new Radios(this.page, 'newRecordStatus');
	readonly reason = new Textarea(this.page, 'reason');
	readonly submitButton = new Button(this.page, 'submit-unarchive');
	readonly errorSummary = this.page.locator('.govuk-error-summary__list');
}
