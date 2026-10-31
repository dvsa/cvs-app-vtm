import { Locator, Page } from '@playwright/test';
import { Autocomplete } from '../../../components/autocomplete.component';
import { Checkbox } from '../../../components/checkbox.component';
import { Input } from '../../../components/input.component';
import { Radios } from '../../../components/radios.component';
import { Select } from '../../../components/select.component';
import { Section, SectionRows, SectionValues, fillFields } from './section';

export class BrakesSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'brakes');
	}

	readonly fields = {
		techRecord_axles: new SectionRows((index) => ({
			brakes_brakeActuator: new Input(this.content, `brakes_brakeActuator-${index + 1}`),
			brakes_leverLength: new Input(this.content, `brakes_leverLength-${index + 1}`),
			brakes_springBrakeParking: new Select(this.content, `brakes_springBrakeParking-${index + 1}`),
			parkingBrakeMrk: new Checkbox(this.content, `parkingBrakeMrk-${index + 1}-checkbox-checkbox`),
		})),
		techRecord_brakes_loadSensingValve: new Radios(this.content, 'techRecord_brakes_loadSensingValve'),
		techRecord_brakes_antilockBrakingSystem: new Radios(this.content, 'techRecord_brakes_antilockBrakingSystem'),
		techRecord_brakes_brakeCodeOriginal: new Autocomplete(this.content, 'techRecord_brakes_brakeCodeOriginal'),
		techRecord_brakes_dataTrBrakeOne: new Input(this.content, 'techRecord_brakes_dataTrBrakeOne'),
		techRecord_brakes_dataTrBrakeTwo: new Input(this.content, 'techRecord_brakes_dataTrBrakeTwo'),
		techRecord_brakes_dataTrBrakeThree: new Input(this.content, 'techRecord_brakes_dataTrBrakeThree'),
		techRecord_brakes_retarderBrakeOne: new Radios(this.content, 'techRecord_brakes_retarderBrakeOne'),
		techRecord_brakes_retarderBrakeTwo: new Radios(this.content, 'techRecord_brakes_retarderBrakeTwo'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
