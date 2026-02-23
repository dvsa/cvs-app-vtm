import { TextInputComponent } from '@/e2e/components/text-input.component';
import { isHeavyTrailer } from '@/e2e/utils/tech-record.util';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../pages/base.page';

export class DimensionsSection extends BasePage {
	readonly frontAxleToRearAxleTextInput = new TextInputComponent(this.page, 'techRecord_frontAxleToRearAxle');
	readonly rearAxleToRearOfTrailerTextInput = new TextInputComponent(this.page, 'techRecord_rearAxleToRearTrl');
	readonly lengthTextInput = new TextInputComponent(this.page, 'techRecord_dimensions_width');
	readonly widthTextInput = new TextInputComponent(this.page, 'techRecord_dimensions_width');
	readonly heightTextInput = new TextInputComponent(this.page, 'techRecord_dimensions_height');
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
	readonly couplingCentreToRearAxleMinimumTextInput = new TextInputComponent(
		this.page,
		'techRecord_couplingCenterToRearAxleMin'
	);
	readonly couplingCentreToRearAxleMaximumTextInput = new TextInputComponent(
		this.page,
		'techRecord_couplingCenterToRearAxleMax'
	);
	readonly couplingCentreToRearOfTrailerMinimumTextInput = new TextInputComponent(
		this.page,
		'techRecord_couplingCenterToRearTrlMin'
	);
	readonly couplingCentreToRearOfTrailerMaximumTextInput = new TextInputComponent(
		this.page,
		'techRecord_couplingCenterToRearTrlMax'
	);
	readonly couplingCentreToRearOfTrailerTextInput = new TextInputComponent(
		this.page,
		'techRecord_centreOfRearmostAxleToRearOfTrl'
	);

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		if (data.techRecord_vehicleType === 'hgv') {
			// Fill axle spacings
			if (Array.isArray(data.techRecord_dimensions_axleSpacing)) {
				if (data.techRecord_dimensions_axleSpacing.length > 1) {
					await this.frontAxleToRearAxleTextInput.fill(data.techRecord_frontAxleToRearAxle);
				}

				for (const [index, axleSpacing] of data.techRecord_dimensions_axleSpacing.entries()) {
					const textInput = new TextInputComponent(this.page, `techRecord_dimensions_axleSpacing_${index}_value`);
					await textInput.fill(axleSpacing.value);
				}
			}

			await this.lengthTextInput.fill(data.techRecord_dimensions_length);
			await this.widthTextInput.fill(data.techRecord_dimensions_width);
			await this.frontOfVehicleToFifthWheelMinimumTextInput.fill(data.techRecord_frontVehicleTo5thWheelCouplingMin);
			await this.frontOfVehicleToFifthWheelMaximumTextInput.fill(data.techRecord_frontVehicleTo5thWheelCouplingMax);
			await this.frontOfVehicleToCouplingDeviceMinimumTextInput.fill(data.techRecord_frontAxleTo5thWheelMin);
			await this.frontOfVehicleToCouplingDeviceMaximumTextInput.fill(data.techRecord_frontAxleTo5thWheelMax);
		}

		if (isHeavyTrailer(data)) {
			// Fill axle spacings
			if (Array.isArray(data.techRecord_dimensions_axleSpacing)) {
				if (data.techRecord_dimensions_axleSpacing.length > 1) {
					await this.frontAxleToRearAxleTextInput.fill(data.techRecord_frontAxleToRearAxle);
					await this.rearAxleToRearOfTrailerTextInput.fill(data.techRecord_rearAxleToRearTrl);
				}

				for (const [index, axleSpacing] of data.techRecord_dimensions_axleSpacing.entries()) {
					const textInput = new TextInputComponent(this.page, `techRecord_dimensions_axleSpacing_${index}_value`);
					await textInput.fill(axleSpacing.value);
				}
			}

			await this.lengthTextInput.fill(data.techRecord_dimensions_length);
			await this.widthTextInput.fill(data.techRecord_dimensions_width);
			await this.couplingCentreToRearAxleMinimumTextInput.fill(data.techRecord_couplingCenterToRearAxleMin);
			await this.couplingCentreToRearAxleMaximumTextInput.fill(data.techRecord_couplingCenterToRearAxleMax);
			await this.couplingCentreToRearOfTrailerMinimumTextInput.fill(data.techRecord_couplingCenterToRearTrlMin);
			await this.couplingCentreToRearOfTrailerMaximumTextInput.fill(data.techRecord_couplingCenterToRearTrlMax);
			await this.couplingCentreToRearOfTrailerTextInput.fill(data.techRecord_centreOfRearmostAxleToRearOfTrl);
		}

		if (data.techRecord_vehicleType === 'psv') {
			await this.frontAxleToRearAxleTextInput.fill(data.techRecord_frontAxleToRearAxle);
			await this.lengthTextInput.fill(data.techRecord_dimensions_length);
			await this.widthTextInput.fill(data.techRecord_dimensions_width);
			await this.heightTextInput.fill(data.techRecord_dimensions_height);
		}
	}
}
