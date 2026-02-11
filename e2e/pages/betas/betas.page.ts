import { CheckboxComponent } from '@/e2e/components/checkbox.component';
import { BasePage } from '../base.page';

export class BetasPage extends BasePage {
	// Form controls
	readonly techRecordRedesignCheckbox = new CheckboxComponent(this.page, 'techrecordredesigncreatedetails');

	// Actions
	readonly cancelButton = this.page.getByRole('button', { name: 'Cancel' });
	readonly savePreferencesButton = this.page.getByRole('button', { name: 'Save preferences' });
}
