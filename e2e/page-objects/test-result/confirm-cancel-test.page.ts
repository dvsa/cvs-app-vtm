import { Button } from '../../components/button.component';
import { Textarea } from '../../components/textarea.component';
import { BasePage } from '../base.page';

export class ConfirmCancelTestPage extends BasePage {
	readonly reason = new Textarea(this.page, 'reason');
	readonly submitButton = new Button(this.page, 'submit');
	readonly backButton = new Button(this.page, 'confirm-cancellation-back-link');
}
