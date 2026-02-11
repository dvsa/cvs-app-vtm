import { TextInputComponent } from '@/e2e/components/text-input.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';

export class DimensionsSection extends BasePage {
	readonly frontAxleToRearAxleTextInput = new TextInputComponent(this.page, 'techRecord_frontAxleToRearAxle');
	readonly lengthTextInput = new TextInputComponent(this.page, 'techRecord_dimensions_width');
	readonly widthTextInput = new TextInputComponent(this.page, 'techRecord_dimensions_width');
	readonly frontOfVehicleToFifthWheelMinimumTextInput = new TextInputComponent(
		this.page,
		'techRecord_frontVehicleTo5thWheelCouplingMin'
	);
	readonly frontOfVehicleToFifthWheelMaximumTextInput = new TextInputComponent(
		this.page,
		'techRecord_frontVehicleTo5thWheelCouplingMax'
	);
	readonly frontOfVehicleToCouplingDeviceMinimumTextInput = new TextInputComponent(
		this.page,
		'techRecord_frontAxleTo5thWheelMin'
	);
	readonly frontOfVehicleToCouplingDeviceMaximumTextInput = new TextInputComponent(
		this.page,
		'techRecord_frontAxleTo5thWheelMax'
	);

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		// @TODO: handle other vehicle types
		if (data.techRecord_vehicleType === 'hgv') {
			await this.frontAxleToRearAxleTextInput.fill(data.techRecord_frontAxleToRearAxle);
			await this.lengthTextInput.fill(data.techRecord_dimensions_length);
			await this.widthTextInput.fill(data.techRecord_dimensions_width);
			await this.frontOfVehicleToFifthWheelMinimumTextInput.fill(data.techRecord_frontVehicleTo5thWheelCouplingMin);
			await this.frontOfVehicleToFifthWheelMaximumTextInput.fill(data.techRecord_frontVehicleTo5thWheelCouplingMax);
			await this.frontOfVehicleToCouplingDeviceMinimumTextInput.fill(data.techRecord_frontAxleTo5thWheelMin);
			await this.frontOfVehicleToCouplingDeviceMaximumTextInput.fill(data.techRecord_frontAxleTo5thWheelMax);

			// Fill axle spacings
			if (Array.isArray(data.techRecord_dimensions_axleSpacing)) {
				for (const [index, axleSpacing] of data.techRecord_dimensions_axleSpacing.entries()) {
					const textInput = new TextInputComponent(this.page, `techRecord_dimensions_axleSpacing_${index}_value`);
					await textInput.fill(axleSpacing.value);
				}
			}
		}
	}
}
