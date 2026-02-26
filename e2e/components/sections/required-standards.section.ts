import { BasePage } from '@/e2e/pages/base.page';
import { RequiredStandardPage } from '@/e2e/pages/test-records/required-standard.page';
import { SelectRequiredStandardPage } from '@/e2e/pages/test-records/select-required-standard.page';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

export class RequiredStandardsSection extends BasePage {
	readonly addRequiredStandardButton = this.page.getByRole('button', {
		name: 'Add required standard',
	});

	async fill(data: Partial<TestResultSchema>): Promise<void> {
		if (!Array.isArray(data.testTypes)) return;

		for (const testType of data.testTypes) {
			if (Array.isArray(testType.requiredStandards)) {
				for (const requiredStandard of testType.requiredStandards) {
					await this.addRequiredStandardButton.click();
					const selectRequiredStandardPage = new SelectRequiredStandardPage(this.page);
					await selectRequiredStandardPage.loaded();
					await selectRequiredStandardPage.fill(requiredStandard);
					const requiredStandardPage = new RequiredStandardPage(this.page);
					await requiredStandardPage.loaded(requiredStandard);
					await requiredStandardPage.fill(requiredStandard);
					await requiredStandardPage.submit();
				}
			}
		}
	}
}
