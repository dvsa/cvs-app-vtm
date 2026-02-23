import { AutoCompleteComponent } from '@/e2e/components/autocomplete.component';
import { TextInputComponent } from '@/e2e/components/text-input.component';
import { isHeavyVehicle } from '@/e2e/utils/tech-record.util';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../pages/base.page';

export class DocumentsSection extends BasePage {
	readonly typeAutocomplete = new AutoCompleteComponent(this.page, 'techRecord_microfilm_microfilmDocumentType');
	readonly rollNumberTextInput = new TextInputComponent(this.page, 'techRecord_microfilm_microfilmRollNumber');
	readonly serialNumberTextInput = new TextInputComponent(this.page, 'techRecord_microfilm_microfilmSerialNumber');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		if (!isHeavyVehicle(data)) return;
		await this.typeAutocomplete.fill(data.techRecord_microfilm_microfilmDocumentType);
		await this.rollNumberTextInput.fill(data.techRecord_microfilm_microfilmRollNumber);
		await this.serialNumberTextInput.fill(data.techRecord_microfilm_microfilmSerialNumber);
	}
}
