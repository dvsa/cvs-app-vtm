import { Locator, Page } from '@playwright/test';
import { Input } from '../../../components/input.component';
import { Radios } from '../../../components/radios.component';
import { Textarea } from '../../../components/textarea.component';
import { Section, SectionValues, fillFields } from './section';

export class DdaSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'dda');
	}

	readonly fields = {
		techRecord_dda_certificateIssued: new Radios(this.content, 'techRecord_dda_certificateIssued'),
		techRecord_dda_wheelchairFittings: new Textarea(this.content, 'techRecord_dda_wheelchairFittings'),
		techRecord_dda_wheelchairLiftPresent: new Radios(this.content, 'techRecord_dda_wheelchairLiftPresent'),
		techRecord_dda_wheelchairLiftInformation: new Textarea(this.content, 'techRecord_dda_wheelchairLiftInformation'),
		techRecord_dda_wheelchairRampPresent: new Radios(this.content, 'techRecord_dda_wheelchairRampPresent'),
		techRecord_dda_wheelchairRampInformation: new Textarea(this.content, 'techRecord_dda_wheelchairRampInformation'),
		techRecord_dda_minEmergencyExits: new Input(this.content, 'techRecord_dda_minEmergencyExits'),
		techRecord_dda_outswing: new Textarea(this.content, 'techRecord_dda_outswing'),
		techRecord_dda_ddaSchedules: new Textarea(this.content, 'techRecord_dda_ddaSchedules'),
		techRecord_dda_seatbeltsFitted: new Input(this.content, 'techRecord_dda_seatbeltsFitted'),
		techRecord_dda_ddaNotes: new Textarea(this.content, 'techRecord_dda_ddaNotes'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
