import { Locator, Page } from '@playwright/test';
import { Button } from '../../../components/button.component';
import { Input } from '../../../components/input.component';
import { Section, SectionRows, SectionValues, fillFields } from '../../../components/section.component';
import { Textarea } from '../../../components/textarea.component';

export class AdditionalDefectsSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'additionalDefects');
	}

	readonly addCustomDefectButton = new Button(this.content, 'add-custom-defect');
	readonly fields = {
		customDefects: new SectionRows((index) => ({
			defectName: new Input(this.content, `defectName-${index}`),
			defectNotes: new Textarea(this.content, `defectNotes-${index}`),
		})),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
