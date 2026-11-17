import { Button } from '../../components/button.component';
import { Textarea } from '../../components/textarea.component';
import { BasePage } from '../base.page';

export class ChangeRecordStatusPage extends BasePage {
	readonly heading = this.page.getByRole('heading', { name: /^(Promote|Archive) technical record$/ });
	readonly reason = new Textarea(this.page, 'reason');
	readonly submitButton = new Button(this.page, 'submit-change-status');
}
