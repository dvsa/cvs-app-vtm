import { Button } from '../../components/button.component';
import { BasePage } from '../base.page';

export class AmendTechnicalRecordReasonPage extends BasePage {
	readonly correctingAnError = this.page.getByRole('radio', { name: 'Some details need to be added or changed' });
	readonly continueButton = new Button(this.page, 'submit');
}
