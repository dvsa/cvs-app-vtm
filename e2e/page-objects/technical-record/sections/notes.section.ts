import { Locator, Page } from '@playwright/test';
import { Textarea } from '../../../components/textarea.component';
import { Section, SectionValues, fillFields } from './section';

export class NotesSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'notes');
	}

	readonly fields = {
		techRecord_notes: new Textarea(this.content, 'techRecord_notes'),
		techRecord_remarks: new Textarea(this.content, 'techRecord_remarks'),
		techRecord_dispensations: new Textarea(this.content, 'techRecord_dispensations'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
