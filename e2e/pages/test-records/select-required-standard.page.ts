import { SpecialistCustomDefectsSchemaPut } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { BasePage } from '../base.page';

export class SelectRequiredStandardPage extends BasePage {
	async loaded(): Promise<void> {
		await this.page.waitForURL(new RegExp('/requiredStandard'));
		await expect(await this.page.title()).toBe('Vehicle Testing Management - Select Required Standard');
	}

	async fill(data: SpecialistCustomDefectsSchemaPut): Promise<void> {
		if (!Array.isArray(data.inspectionTypes)) return;
		await this.page.getByRole('link', { name: data.inspectionTypes[0] }).click();
		await this.page.getByRole('link', { name: data.refCalculation }).click();
		await this.page.getByRole('link', { name: data.requiredStandard }).click();
	}
}
