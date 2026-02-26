import { BasePage } from '@/e2e/pages/base.page';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { TextareaComponent } from '../textarea.component';

export class AdditionalNotesSection extends BasePage {
	readonly additionalNotesRecordedTextarea = new TextareaComponent(this.page, 'additionalNotesRecorded');

	async fill(data: Partial<TestResultSchema>): Promise<void> {
		if (!Array.isArray(data.testTypes)) return;

		for (const testType of data.testTypes) {
			await this.additionalNotesRecordedTextarea.fill(testType.additionalNotesRecorded);
		}
	}
}
