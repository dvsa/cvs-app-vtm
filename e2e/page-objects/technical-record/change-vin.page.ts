import { Button } from '../../components/button.component';
import { Input } from '../../components/input.component';
import { BasePage } from '../base.page';

export class ChangeVinPage extends BasePage {
	readonly heading = this.page.getByRole('heading', { name: 'Change VIN', exact: true });
	readonly vin = new Input(this.page, 'vin');
	readonly saveButton = new Button(this.page, 'submit-vin');
	readonly backButton = new Button(this.page, 'back-button');
	readonly requiredVinError = this.page.locator('#vin-global-error');
}
