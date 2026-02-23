import { SelectComponent } from '@/e2e/components/select.component';
import { TextInputComponent } from '@/e2e/components/text-input.component';
import { isHeavyTrailer } from '@/e2e/utils/tech-record.util';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../pages/base.page';

export class WeightsSection extends BasePage {
	readonly grossGbWeightTextInput = new TextInputComponent(this.page, 'techRecord_grossGbWeight');
	readonly grossEecWeightTextInput = new TextInputComponent(this.page, 'techRecord_grossEecWeight');
	readonly grossDesignWeightTextInput = new TextInputComponent(this.page, 'techRecord_grossDesignWeight');
	readonly grossKerbWeightTextInput = new TextInputComponent(this.page, 'techRecord_grossKerbWeight');
	readonly grossLadenWeightTextInput = new TextInputComponent(this.page, 'techRecord_grossLadenWeight');

	readonly trainGbWeightTextInput = new TextInputComponent(this.page, 'techRecord_trainGbWeight');
	readonly trainEecWeightTextInput = new TextInputComponent(this.page, 'techRecord_trainEecWeight');
	readonly trainDesignWeightTextInput = new TextInputComponent(this.page, 'techRecord_trainDesignWeight');
	readonly trainGBMaxWeightTextInput = new TextInputComponent(this.page, 'techRecord_maxTrainGbWeight');

	readonly maxTrainGbWeightTextInput = new TextInputComponent(this.page, 'techRecord_maxTrainGbWeight');
	readonly maxTrainEecWeightTextInput = new TextInputComponent(this.page, 'techRecord_maxTrainEecWeight');
	readonly maxTrainDesignWeightTextInput = new TextInputComponent(this.page, 'techRecord_maxTrainDesignWeight');

	readonly unladenWeightTextInput = new TextInputComponent(this.page, 'techRecord_unladenWeight');

	readonly couplingTypeSelect = new SelectComponent(this.page, 'techRecord_couplingType');
	readonly maxLoadOnCouplingTextInput = new TextInputComponent(this.page, 'techRecord_maxLoadOnCoupling');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
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

		if (isHeavyTrailer(data)) {
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

			// Populate coupling information
			await this.couplingTypeSelect.fill(data.techRecord_couplingType);
			await this.maxLoadOnCouplingTextInput.fill(data.techRecord_maxLoadOnCoupling);
		}

		if (data.techRecord_vehicleType === 'psv') {
			// Populate axles
			if (Array.isArray(data.techRecord_axles)) {
				for (const axle of data.techRecord_axles) {
					const kerbWeightInput = new TextInputComponent(this.page, `weights_kerbWeight-${axle.axleNumber}`);
					const ladenWeightInput = new TextInputComponent(this.page, `weights_ladenWeight-${axle.axleNumber}`);
					const gbMaxWeightInput = new TextInputComponent(this.page, `weights_gbWeight-${axle.axleNumber}`);
					const designWeightTextInput = new TextInputComponent(this.page, `weights_designWeight-${axle.axleNumber}`);
					await kerbWeightInput.fill(axle.weights_kerbWeight);
					await ladenWeightInput.fill(axle.weights_ladenWeight);
					await gbMaxWeightInput.fill(axle.weights_gbWeight);
					await designWeightTextInput.fill(axle.weights_designWeight);
				}
			}

			// Populate gross weights
			await this.grossLadenWeightTextInput.fill(data.techRecord_grossLadenWeight);
			await this.grossEecWeightTextInput.fill(data.techRecord_grossGbWeight);
			await this.grossKerbWeightTextInput.fill(data.techRecord_grossKerbWeight);
			await this.grossDesignWeightTextInput.fill(data.techRecord_grossDesignWeight);

			// Populate train weights
			await this.trainGBMaxWeightTextInput.fill(data.techRecord_maxTrainGbWeight);
			await this.trainDesignWeightTextInput.fill(data.techRecord_trainDesignWeight);

			// Populate unladen weight
			await this.unladenWeightTextInput.fill(data.techRecord_unladenWeight);
		}
	}
}
