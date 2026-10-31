import { Locator, Page } from '@playwright/test';
import { DateInput } from '../../../components/date-input.component';
import { Input } from '../../../components/input.component';
import { Radios } from '../../../components/radios.component';
import { Section, SectionValues, fillFields } from './section';

export class SeatsAndVehicleSizeSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'seats-and-vehicle-size');
	}

	readonly fields = {
		techRecord_seatsUpperDeck: new Input(this.content, 'techRecord_seatsUpperDeck'),
		techRecord_seatsLowerDeck: new Input(this.content, 'techRecord_seatsLowerDeck'),
		techRecord_standingCapacity: new Input(this.content, 'techRecord_standingCapacity'),
		techRecord_dda_wheelchairCapacity: new Input(this.content, 'techRecord_dda_wheelchairCapacity'),
		techRecord_vehicleClass_description: new Radios(this.content, 'techRecord_vehicleClass_description'),
		techRecord_vehicleSize: new Radios(this.content, 'techRecord_vehicleSize'),
		techRecord_numberOfSeatbelts: new Input(this.content, 'techRecord_numberOfSeatbelts'),
		techRecord_seatbeltInstallationApprovalDate: new DateInput(
			this.content,
			'techRecord_seatbeltInstallationApprovalDate'
		),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
