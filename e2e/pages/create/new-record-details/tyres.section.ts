import { SelectComponent } from '@/e2e/components/select.component';
import { TextInputComponent } from '@/e2e/components/text-input.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';

export class TyresSection extends BasePage {
	readonly tyreUseCodeSelect = new SelectComponent(this.page, 'techRecord_tyreUseCode');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		// @TODO: handle other vehicle types
		if (data.techRecord_vehicleType === 'hgv') {
			// Populate axles
			if (Array.isArray(data.techRecord_axles)) {
				for (const axle of data.techRecord_axles) {
					const tyreCodeTextInput = new TextInputComponent(this.page, `tyres_tyreCode-${axle.axleNumber}`);
					const fitmentCodeSelect = new SelectComponent(this.page, `tyres_fitmentCode-${axle.axleNumber}`);
					await tyreCodeTextInput.fill(axle.tyres_tyreCode);
					await fitmentCodeSelect.fill(axle.tyres_fitmentCode);
				}
			}

			// Populate tyre use code
			await this.tyreUseCodeSelect.fill(data.techRecord_tyreUseCode);
		}
	}
}
