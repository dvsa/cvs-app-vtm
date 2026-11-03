import { Locator, Page } from '@playwright/test';
import { Autocomplete } from '../../../components/autocomplete.component';
import { Input } from '../../../components/input.component';
import { Radios } from '../../../components/radios.component';
import { Section, SectionValues, fillFields } from '../../../components/section.component';
import { Select } from '../../../components/select.component';

export class VehicleSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'vehicle');
	}

	readonly odometerReadingUnitsSelect = new Select(this.content, 'odometerReadingUnits');

	readonly fields = {
		vtg15Required: new Radios(this.content, 'vtg15Required'),
		unNumber: new Input(this.content, 'unNumber'),
		primaryHazardClassification: new Select(this.content, 'primaryHazardClassification'),
		secondaryHazardClassification: new Select(this.content, 'secondaryHazardClassification'),
		countryOfRegistration: new Autocomplete(this.content, 'countryOfRegistration'),
		euVehicleCategory: new Select(this.content, 'euVehicleCategory'),
		odometerReading: new Input(this.content, 'odometerReading'),
		odometerReadingUnits: new Radios(this.content, 'odometerReadingUnits'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		for (const [key, value] of Object.entries(values)) {
			if (
				key === 'odometerReadingUnits' &&
				values.odometerReadingUnits != null &&
				(await this.odometerReadingUnitsSelect.locator.count())
			) {
				await this.odometerReadingUnitsSelect.fill(values.odometerReadingUnits);
			} else {
				await fillFields(this.fields, { [key]: value });
			}
		}
	}
}
