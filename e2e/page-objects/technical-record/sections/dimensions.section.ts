import { Locator, Page } from '@playwright/test';
import { Input } from '../../../components/input.component';
import { Section, SectionRows, SectionValues, fillFields } from './section';

export class DimensionsSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'dimensions');
	}

	readonly fields = {
		techRecord_frontAxleToRearAxle: new Input(this.content, 'techRecord_frontAxleToRearAxle'),
		techRecord_rearAxleToRearTrl: new Input(this.content, 'techRecord_rearAxleToRearTrl'),
		techRecord_dimensions_axleSpacing: new SectionRows((index) => ({
			value: new Input(this.content, `techRecord_dimensions_axleSpacing_${index}_value`),
		})),
		techRecord_dimensions_length: new Input(this.content, 'techRecord_dimensions_length'),
		techRecord_dimensions_width: new Input(this.content, 'techRecord_dimensions_width'),
		techRecord_dimensions_height: new Input(this.content, 'techRecord_dimensions_height'),
		techRecord_couplingCenterToRearAxleMin: new Input(this.content, 'techRecord_couplingCenterToRearAxleMin'),
		techRecord_couplingCenterToRearAxleMax: new Input(this.content, 'techRecord_couplingCenterToRearAxleMax'),
		techRecord_couplingCenterToRearTrlMin: new Input(this.content, 'techRecord_couplingCenterToRearTrlMin'),
		techRecord_couplingCenterToRearTrlMax: new Input(this.content, 'techRecord_couplingCenterToRearTrlMax'),
		techRecord_centreOfRearmostAxleToRearOfTrl: new Input(this.content, 'techRecord_centreOfRearmostAxleToRearOfTrl'),
		techRecord_frontVehicleTo5thWheelCouplingMin: new Input(
			this.content,
			'techRecord_frontVehicleTo5thWheelCouplingMin'
		),
		techRecord_frontVehicleTo5thWheelCouplingMax: new Input(
			this.content,
			'techRecord_frontVehicleTo5thWheelCouplingMax'
		),
		techRecord_frontAxleTo5thWheelMin: new Input(this.content, 'techRecord_frontAxleTo5thWheelMin'),
		techRecord_frontAxleTo5thWheelMax: new Input(this.content, 'techRecord_frontAxleTo5thWheelMax'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
