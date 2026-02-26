import { BasePage } from '@/e2e/pages/base.page';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

export class AdditionalDefectsSection extends BasePage {
	readonly addAdditionalDefectsSection = this.page.getByRole('button', {
		name: 'Add Additional Defect',
	});

	async fill(data: Partial<TestResultSchema>): Promise<void> {
		if (!Array.isArray(data.testTypes)) return;

		for (const testType of data.testTypes) {
			if (Array.isArray(testType.customDefects)) {
				// @TODO - fill in custom defects form
			}
		}
	}
}
