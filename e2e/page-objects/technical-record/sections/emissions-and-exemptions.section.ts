import { Locator, Page } from '@playwright/test';
import { Input } from '../../../components/input.component';
import { Radios } from '../../../components/radios.component';
import { Section, SectionValues, fillFields } from './section';

export class EmissionsAndExemptionsSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'emissions-and-exemptions');
	}

	readonly fields = {
		techRecord_euroStandard: new Radios(this.content, 'techRecord_euroStandard'),
		techRecord_emissionsLimit: new Input(this.content, 'techRecord_emissionsLimit'),
		techRecord_speedLimiterMrk: new Radios(this.content, 'techRecord_speedLimiterMrk'),
		techRecord_tachoExemptMrk: new Radios(this.content, 'techRecord_tachoExemptMrk'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
