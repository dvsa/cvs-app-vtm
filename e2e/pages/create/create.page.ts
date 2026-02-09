import { CheckboxComponent } from '@/e2e/components/checkbox.component';
import { RadiosComponent } from '@/e2e/components/radios.component';
import { TextInputComponent } from '@/e2e/components/text-input.component';
import { BasePage } from '../base.page';

export class CreatePage extends BasePage {
	// Form controls
	readonly vin = new TextInputComponent(this.page, 'input-vin');
	readonly generateCTZNumber = new CheckboxComponent(this.page, 'generate-c-or-z-num');
	readonly vrmOrTrailerId = new TextInputComponent(this.page, 'input-vrm-or-trailer-id');
	readonly vehicleStatus = new RadiosComponent(this.page, 'change-vehicle-status-select');
	readonly vehicleType = new RadiosComponent(this.page, 'change-vehicle-type-select');

	// Actions
	readonly continueButton = this.page.getByRole('button', { name: 'Continue' });
	readonly cancelButton = this.page.getByRole('button', { name: 'Cancel' });
}
