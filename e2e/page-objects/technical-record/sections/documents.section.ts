import { Locator, Page } from '@playwright/test';
import { Autocomplete } from '../../../components/autocomplete.component';
import { Input } from '../../../components/input.component';
import { Section, SectionValues, fillFields } from './section';

export class DocumentsSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'documents');
	}

	readonly fields = {
		techRecord_microfilm_microfilmDocumentType: new Autocomplete(
			this.content,
			'techRecord_microfilm_microfilmDocumentType'
		),
		techRecord_microfilm_microfilmRollNumber: new Input(this.content, 'techRecord_microfilm_microfilmRollNumber'),
		techRecord_microfilm_microfilmSerialNumber: new Input(this.content, 'techRecord_microfilm_microfilmSerialNumber'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
