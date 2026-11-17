import { Button } from '../../components/button.component';
import { BasePage } from '../base.page';

export class CancelBatchPage extends BasePage {
	readonly heading = this.page.getByRole('heading', {
		name: 'Are you sure you want to cancel creating this batch of technical records?',
		exact: true,
	});
	readonly cancelButton = new Button(this.page, 'cancel-btn');
	readonly backButton = new Button(this.page, 'back-btn');
}
