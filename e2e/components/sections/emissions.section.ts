import { BasePage } from '@/e2e/pages/base.page';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { RadiosComponent } from '../radios.component';
import { TextInputComponent } from '../text-input.component';

export class EmissionsSection extends BasePage {
	readonly emissionsStandardRadio = new RadiosComponent(this.page, 'emissionStandard');
	readonly smokeTestKLimitAppliedTextInput = new TextInputComponent(this.page, 'smokeTestKLimitApplied');
	readonly fuelTypeRadios = new RadiosComponent(this.page, 'fuelType');
	readonly modTypeCodeRadios = new RadiosComponent(this.page, 'code');
	readonly modTypeDescriptionRadios = new RadiosComponent(this.page, 'description');
	readonly modificationTypeUsedTextInput = new TextInputComponent(this.page, 'modificationTypeUsed');
	readonly particulateTrapFittedTextInput = new TextInputComponent(this.page, 'particulateTrapFitted');
	readonly particulateTrapSerialNumberTextInput = new TextInputComponent(this.page, 'particulateTrapSerialNumber');

	async fill(data: Partial<TestResultSchema>): Promise<void> {
		if (!Array.isArray(data.testTypes)) return;

		for (const testType of data.testTypes) {
			await this.emissionsStandardRadio.fill(testType.emissionStandard);
			await this.smokeTestKLimitAppliedTextInput.fill(testType.smokeTestKLimitApplied);
			await this.fuelTypeRadios.fill(testType.fuelType);
			if (typeof testType.modType === 'object' && testType.modType !== null) {
				await this.modTypeCodeRadios.fill(testType.modType.code);
				await this.modTypeDescriptionRadios.fill(testType.modType.description);

				if (testType.modType.code === 'P') {
					await this.particulateTrapFittedTextInput.fill(testType.particulateTrapFitted);
					await this.particulateTrapSerialNumberTextInput.fill(testType.particulateTrapSerialNumber);
				}

				if (testType.modType.code === 'M' || testType.modType.code === 'G') {
					await this.modificationTypeUsedTextInput.fill(testType.modificationTypeUsed);
				}
			}
		}
	}
}
