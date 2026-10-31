import { Locator, Page } from '@playwright/test';
import { Section, SectionValues, fillFields } from '../../../components/section.component';
import { Textarea } from '../../../components/textarea.component';

export class NotesSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'notes');
	}

	readonly fields = {
		additionalNotesRecorded: new Textarea(this.content, 'additionalNotesRecorded'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
