import { Locator, Page } from '@playwright/test';
import { Textarea } from '../../../components/textarea.component';
import { Section, SectionValues, fillFields } from './section';

export class ReasonForCreationSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'reason-for-creation');
	}

	readonly fields = {
		techRecord_reasonForCreation: new Textarea(this.content, 'techRecord_reasonForCreation'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
