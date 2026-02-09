import { BasePage } from '../base.page';

export class DuplicateVinPage extends BasePage {
	readonly confirmButton = this.page.getByRole('button', { name: 'Confirm' });
	readonly backButton = this.page.getByRole('button', { name: 'Back' });
}
