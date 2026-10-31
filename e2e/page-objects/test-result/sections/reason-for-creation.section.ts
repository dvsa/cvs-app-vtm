import { Locator, Page } from '@playwright/test';
import { Section, SectionValues, fillFields } from '../../../components/section.component';
import { Textarea } from '../../../components/textarea.component';

export class ReasonForCreationSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'reason-for-creation');
	}

	readonly fields = {
		reasonForCreation: new Textarea(this.content, 'reasonForCreation'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
