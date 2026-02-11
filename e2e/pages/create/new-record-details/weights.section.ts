import { TextInputComponent } from '@/e2e/components/text-input.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';

export class WeightsSection extends BasePage {
	readonly grossGbWeightTextInput = new TextInputComponent(this.page, 'techRecord_grossGbWeight');
	readonly grossEecWeightTextInput = new TextInputComponent(this.page, 'techRecord_grossEecWeight');
	readonly grossDesignWeightTextInput = new TextInputComponent(this.page, 'techRecord_grossDesignWeight');

	readonly trainGbWeightTextInput = new TextInputComponent(this.page, 'techRecord_trainGbWeight');
	readonly trainEecWeightTextInput = new TextInputComponent(this.page, 'techRecord_trainEecWeight');
	readonly trainDesignWeightTextInput = new TextInputComponent(this.page, 'techRecord_trainDesignWeight');

	readonly maxTrainGbWeightTextInput = new TextInputComponent(this.page, 'techRecord_maxTrainGbWeight');
	readonly maxTrainEecWeightTextInput = new TextInputComponent(this.page, 'techRecord_maxTrainEecWeight');
	readonly maxTrainDesignWeightTextInput = new TextInputComponent(this.page, 'techRecord_maxTrainDesignWeight');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		// @TODO: handle other vehicle types
		if (data.techRecord_vehicleType === 'hgv') {
			// Populate axles
			if (Array.isArray(data.techRecord_axles)) {
				for (const axle of data.techRecord_axles) {
					const gbWeightTextInput = new TextInputComponent(this.page, `weights_gbWeight-${axle.axleNumber}`);
					const eecWeightTextInput = new TextInputComponent(this.page, `weights_eecWeight-${axle.axleNumber}`);
					const designWeightTextInput = new TextInputComponent(this.page, `weights_designWeight-${axle.axleNumber}`);
					await gbWeightTextInput.fill(axle.weights_gbWeight);
					await eecWeightTextInput.fill(axle.weights_eecWeight);
					await designWeightTextInput.fill(axle.weights_designWeight);
				}
			}

			// Populate gross weights
			await this.grossGbWeightTextInput.fill(data.techRecord_grossGbWeight);
			await this.grossEecWeightTextInput.fill(data.techRecord_grossEecWeight);
			await this.grossDesignWeightTextInput.fill(data.techRecord_grossDesignWeight);

			// Populate train weights
			await this.trainGbWeightTextInput.fill(data.techRecord_trainGbWeight);
			await this.trainEecWeightTextInput.fill(data.techRecord_trainEecWeight);
			await this.trainDesignWeightTextInput.fill(data.techRecord_trainDesignWeight);

			// Populate max train weights
			await this.maxTrainGbWeightTextInput.fill(data.techRecord_maxTrainGbWeight);
			await this.maxTrainEecWeightTextInput.fill(data.techRecord_maxTrainEecWeight);
			await this.maxTrainDesignWeightTextInput.fill(data.techRecord_maxTrainDesignWeight);
		}
	}
}
