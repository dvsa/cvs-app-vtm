import { BasePage } from '@/e2e/pages/base.page';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

export class CustomDefectsSection extends BasePage {
	readonly addCustomDefectButton = this.page.getByRole('button', {
		name: 'Add custom defect',
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
