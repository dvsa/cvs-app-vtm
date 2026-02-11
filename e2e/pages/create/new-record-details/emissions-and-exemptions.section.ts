import { RadiosComponent } from '@/e2e/components/radios.component';
import { TextInputComponent } from '@/e2e/components/text-input.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';

export class EmissionsAndExemptionsSection extends BasePage {
	readonly drawbarCouplingFittedRadios = new RadiosComponent(this.page, 'techRecord_drawbarCouplingFitted');
	readonly euroStandardRadios = new RadiosComponent(this.page, 'techRecord_euroStandard');
	readonly emissionLimitTextInput = new TextInputComponent(this.page, 'techRecord_emissionsLimit');
	readonly speedLimiterExemptRadios = new RadiosComponent(this.page, 'techRecord_speedLimiterMrk');
	readonly tachoExemptRadios = new RadiosComponent(this.page, 'techRecord_tachoExemptMrk');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		// @TODO: handle other vehicle types
		if (data.techRecord_vehicleType === 'hgv') {
			await this.drawbarCouplingFittedRadios.fill(data.techRecord_drawbarCouplingFitted);
			await this.euroStandardRadios.fill(data.techRecord_euroStandard);
			await this.emissionLimitTextInput.fill(data.techRecord_emissionsLimit);
			await this.speedLimiterExemptRadios.fill(data.techRecord_speedLimiterMrk);
			await this.tachoExemptRadios.fill(data.techRecord_tachoExemptMrk);
		}
	}
}
