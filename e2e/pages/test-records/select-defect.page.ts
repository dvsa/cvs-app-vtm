import { DefectDetailsSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { BasePage } from '../base.page';

export class SelectDefectPage extends BasePage {
	async fill(data: DefectDetailsSchema): Promise<void> {
		const defectCategory = `${data.imNumber}. ${data.imDescription}`;
		const defectItemNumber = `${data.imNumber}.${data.itemNumber}`;
		const defectItem = `${defectItemNumber}. ${data.itemDescription}`;

		await this.page.getByRole('link', { name: defectCategory }).click();
		await this.page.getByRole('link', { name: defectItem }).click();

		if (data.deficiencyCategory === 'advisory') {
			await this.page.getByRole('link', { name: defectItemNumber }).click();
		}

		if (data.deficiencyCategory !== 'advisory') {
			const deficiencyId = data.deficiencyId ? `(${data.deficiencyId})` : '';
			const deficiencySubId = data.deficiencySubId ? `(${data.deficiencySubId})` : '';
			const stdForProhibition = data.stdForProhibition ? '*' : '';
			const deficiency = `${defectCategory} ${deficiencyId}${deficiencySubId}${stdForProhibition}`;
			await this.page.getByRole('link', { name: deficiency }).click();
		}
	}
}
