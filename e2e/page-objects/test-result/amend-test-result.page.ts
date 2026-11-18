import { Button } from '../../components/button.component';
import { Radios } from '../../components/radios.component';
import { TestResultPage } from './test-result.page';

export class AmendTestResultPage extends TestResultPage {
	readonly reason = new Radios(this.page, 'reason');
	readonly continueButton = new Button(this.page, 'submit');
	readonly cancelButton = new Button(this.page, 'cancel');
	readonly cancelHeading = this.page.getByRole('heading', {
		name: 'Are you sure you want to cancel these changes?',
		exact: true,
	});
	readonly discardChangesButton = new Button(this.page, 'confirm-cancel-amend');
	readonly restoreChangesButton = new Button(this.page, 'retract-cancel-amend');
}
