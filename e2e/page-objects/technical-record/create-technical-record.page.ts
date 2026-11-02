import { Button } from '../../components/button.component';
import { Checkbox } from '../../components/checkbox.component';
import { Input } from '../../components/input.component';
import { Radios } from '../../components/radios.component';
import { BasePage } from '../base.page';

export class CreateTechnicalRecordPage extends BasePage {
	readonly heading = this.page.getByRole('heading', { name: 'Create a new technical record', exact: true });
	readonly vin = new Input(this.page, 'input-vin');
	readonly vrmTrailerId = new Input(this.page, 'input-vrm-or-trailer-id');
	readonly generateId = new Checkbox(this.page, 'generate-c-or-z-num-checkbox');
	readonly vehicleStatus = new Radios(this.page, 'change-vehicle-status-select');
	readonly vehicleType = new Radios(this.page, 'change-vehicle-type-select');
	readonly continueButton = new Button(this.page, 'submit');
}
