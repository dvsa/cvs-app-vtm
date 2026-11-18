import { CheckboxGroup } from '../../components/checkbox-group.component';
import { Textarea } from '../../components/textarea.component';
import { BasePage } from '../base.page';

export class AbandonTestPage extends BasePage {
	readonly reasons = new CheckboxGroup(this.page.locator('govuk-checkbox-group'), 'reasonForAbandoning');
	readonly notes = new Textarea(this.page, 'additionalCommentsForAbandon');
	readonly submitButton = this.page.getByRole('button', { name: 'Confirm and save', exact: true });
	readonly cancelButton = this.page.getByRole('button', { name: 'Cancel', exact: true });
}
