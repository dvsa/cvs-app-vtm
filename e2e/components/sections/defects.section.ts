import { BasePage } from '@/e2e/pages/base.page';
import { DefectPage } from '@/e2e/pages/test-records/defect.page';
import { SelectDefectPage } from '@/e2e/pages/test-records/select-defect.page';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

export class DefectsSection extends BasePage {
	readonly addDefectButton = this.page.getByRole('button', { name: 'Add defect' });

	async fill(data: Partial<TestResultSchema>): Promise<void> {
		if (!Array.isArray(data.testTypes)) return;

		for (const testType of data.testTypes) {
			if (Array.isArray(testType.defects)) {
				for (const defect of testType.defects) {
					await this.addDefectButton.click();
					const selectDefectPage = new SelectDefectPage(this.page);
					await selectDefectPage.fill(defect);
					const defectPage = new DefectPage(this.page);
					await defectPage.loaded(defect);
					await defectPage.fill(defect);
					await defectPage.submit();
				}
			}
		}
	}
}
