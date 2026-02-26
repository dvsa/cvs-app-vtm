import { BasePage } from '@/e2e/pages/base.page';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { AutoCompleteComponent } from '../autocomplete.component';
import { RadiosComponent } from '../radios.component';
import { SelectComponent } from '../select.component';
import { TextInputComponent } from '../text-input.component';

export class VehicleDetailsSection extends BasePage {
	readonly countryOfRegistrationAutocomplete = new AutoCompleteComponent(this.page, 'countryOfRegistration');
	readonly euVehicleCategorySelect = new SelectComponent(this.page, 'euVehicleCategory');
	readonly odometerReadingTextInput = new TextInputComponent(this.page, 'odometerReading');
	readonly odometerReadingUnitsRadios = new RadiosComponent(this.page, 'odometerReadingUnits');

	async fill(data: Partial<TestResultSchema>): Promise<void> {
		await this.countryOfRegistrationAutocomplete.fill(data.countryOfRegistration);
		await this.euVehicleCategorySelect.fill(data.euVehicleCategory);
		await this.odometerReadingTextInput.fill(data.odometerReading);
		await this.odometerReadingUnitsRadios.fill(data.odometerReadingUnits);
	}
}
