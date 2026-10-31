import { Locator, Page } from '@playwright/test';
import { Input } from '../../../components/input.component';
import { Select } from '../../../components/select.component';
import { Section, SectionRows, SectionValues, fillFields } from './section';

export class WeightsSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'weights');
	}

	readonly fields = {
		techRecord_brakes_dtpNumber: new Input(this.content, 'techRecord_brakes_dtpNumber'),
		techRecord_axles: new SectionRows((index) => ({
			weights_gbWeight: new Input(this.content, `weights_gbWeight-${index + 1}`),
			weights_eecWeight: new Input(this.content, `weights_eecWeight-${index + 1}`),
			weights_kerbWeight: new Input(this.content, `weights_kerbWeight-${index + 1}`),
			weights_ladenWeight: new Input(this.content, `weights_ladenWeight-${index + 1}`),
			weights_designWeight: new Input(this.content, `weights_designWeight-${index + 1}`),
		})),
		techRecord_grossGbWeight: new Input(this.content, 'techRecord_grossGbWeight'),
		techRecord_grossEecWeight: new Input(this.content, 'techRecord_grossEecWeight'),
		techRecord_grossKerbWeight: new Input(this.content, 'techRecord_grossKerbWeight'),
		techRecord_grossLadenWeight: new Input(this.content, 'techRecord_grossLadenWeight'),
		techRecord_grossDesignWeight: new Input(this.content, 'techRecord_grossDesignWeight'),
		techRecord_trainGbWeight: new Input(this.content, 'techRecord_trainGbWeight'),
		techRecord_trainEecWeight: new Input(this.content, 'techRecord_trainEecWeight'),
		techRecord_trainDesignWeight: new Input(this.content, 'techRecord_trainDesignWeight'),
		techRecord_maxTrainGbWeight: new Input(this.content, 'techRecord_maxTrainGbWeight'),
		techRecord_maxTrainEecWeight: new Input(this.content, 'techRecord_maxTrainEecWeight'),
		techRecord_maxTrainDesignWeight: new Input(this.content, 'techRecord_maxTrainDesignWeight'),
		techRecord_couplingType: new Select(this.content, 'techRecord_couplingType'),
		techRecord_maxLoadOnCoupling: new Input(this.content, 'techRecord_maxLoadOnCoupling'),
		techRecord_unladenWeight: new Input(this.content, 'techRecord_unladenWeight'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
