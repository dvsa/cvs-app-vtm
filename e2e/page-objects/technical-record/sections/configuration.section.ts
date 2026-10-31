import { Locator, Page } from '@playwright/test';
import { Input } from '../../../components/input.component';
import { Radios } from '../../../components/radios.component';
import { Select } from '../../../components/select.component';
import { Section, SectionValues, fillFields } from './section';

export class ConfigurationSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'configuration');
	}

	readonly fields = {
		techRecord_offRoad: new Radios(this.content, 'techRecord_offRoad'),
		techRecord_departmentalVehicleMarker: new Radios(this.content, 'techRecord_departmentalVehicleMarker'),
		techRecord_alterationMarker: new Radios(this.content, 'techRecord_alterationMarker'),
		techRecord_fuelPropulsionSystem: new Select(this.content, 'techRecord_fuelPropulsionSystem'),
		techRecord_speedRestriction: new Input(this.content, 'techRecord_speedRestriction'),
		techRecord_roadFriendly: new Radios(this.content, 'techRecord_roadFriendly'),
		techRecord_drawbarCouplingFitted: new Radios(this.content, 'techRecord_drawbarCouplingFitted'),
		techRecord_suspensionType: new Select(this.content, 'techRecord_suspensionType'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
