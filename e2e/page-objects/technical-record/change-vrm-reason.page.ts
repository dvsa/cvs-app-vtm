import { Button } from '../../components/button.component';
import { BasePage } from '../base.page';

export class ChangeVrmReasonPage extends BasePage {
	readonly heading = this.page.getByRole('heading', { name: 'Why are you changing the VRM?', exact: true });
	readonly correctingAnError = this.page.getByRole('radio', { name: 'Correcting an error', exact: true });
	readonly cherishedTransfer = this.page.getByRole('radio', { name: 'Cherished transfer', exact: true });
	readonly continueButton = new Button(this.page, 'submit-vrm');
}
