import { Locator, Page } from '@playwright/test';
import { Autocomplete } from '../../../components/autocomplete.component';
import { Button } from '../../../components/button.component';
import { CheckboxGroup } from '../../../components/checkbox-group.component';
import { DateInput } from '../../../components/date-input.component';
import { InputOrSelect } from '../../../components/input-or-select.component';
import { Input } from '../../../components/input.component';
import { Radios } from '../../../components/radios.component';
import { Select } from '../../../components/select.component';
import { Section, SectionValues, fillFields } from './section';

export class GeneralVehicleDetailsSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'general-vehicle-details');
	}

	readonly numberOfAxlesConfirmButton = new Button(this.content, 'confirm-axles-button');
	readonly numberOfAxlesClearAxlesButton = new Button(this.content, 'clear-axles-button');

	readonly fields = {
		techRecord_regnDate: new DateInput(this.content, 'techRecord_regnDate'),
		techRecord_manufactureMonth: new Select(this.content, 'techRecord_manufactureMonth'),
		techRecord_manufactureYear: new Input(this.content, 'techRecord_manufactureYear'),
		techRecord_firstUseDate: new DateInput(this.content, 'techRecord_firstUseDate'),
		techRecord_brakes_dtpNumber: new Autocomplete(this.content, 'techRecord_brakes_dtpNumber'),
		techRecord_vehicleConfiguration: new InputOrSelect(this.content, 'techRecord_vehicleConfiguration'),
		techRecord_vehicleClass_description: new Select(this.content, 'techRecord_vehicleClass_description'),
		techRecord_frameDescription: new Select(this.content, 'techRecord_frameDescription'),
		techRecord_chassisMake: new Input(this.content, 'techRecord_chassisMake'),
		techRecord_chassisModel: new Input(this.content, 'techRecord_chassisModel'),
		techRecord_bodyMake: new Input(this.content, 'techRecord_bodyMake'),
		techRecord_bodyModel: new Input(this.content, 'techRecord_bodyModel'),
		techRecord_vehicleSubclass: new CheckboxGroup(this.content, 'techRecord_vehicleSubclass'),
		techRecord_make: new Select(this.content, 'techRecord_make'),
		techRecord_model: new Input(this.content, 'techRecord_model'),
		techRecord_bodyType_description: new InputOrSelect(this.content, 'techRecord_bodyType_description'),
		techRecord_modelLiteral: new Input(this.content, 'techRecord_modelLiteral'),
		techRecord_functionCode: new Select(this.content, 'techRecord_functionCode'),
		techRecord_conversionRefNo: new Input(this.content, 'techRecord_conversionRefNo'),
		techRecord_euVehicleCategory: new Radios(this.content, 'techRecord_euVehicleCategory'),
		techRecord_numberOfWheelsDriven: new Input(this.content, 'techRecord_numberOfWheelsDriven'),
		techRecord_noOfAxles: new Input(this.content, 'techRecord_noOfAxles'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
