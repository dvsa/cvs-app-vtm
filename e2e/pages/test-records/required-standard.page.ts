import { CheckboxComponent } from '@/e2e/components/checkbox.component';
import { TextareaComponent } from '@/e2e/components/textarea.component';
import { SpecialistCustomDefectsSchemaPut } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { BasePage } from '../base.page';

export class RequiredStandardPage extends BasePage {
	readonly additionalNotesTextarea = new TextareaComponent(this.page, 'additionalNotes');
	readonly prsCheckbox = new CheckboxComponent(this.page, 'prs');
	readonly confirmButton = this.page.getByRole('button', { name: 'Confirm' });
	readonly cancelLink = this.page.getByRole('link', { name: 'Cancel' });

	async loaded(data: SpecialistCustomDefectsSchemaPut): Promise<void> {
		if (!Array.isArray(data.inspectionTypes)) {
			throw new Error('inspectionTypes is not an array');
		}

		const url = new RegExp(`/requiredStandard/${data.inspectionTypes[0]}/${data.rsNumber}`);
		await this.page.waitForURL(url);
		expect(await this.page.title()).toBe('Vehicle Testing Management - Required Standard');
	}

	async fill(data: SpecialistCustomDefectsSchemaPut): Promise<void> {
		await this.additionalNotesTextarea.fill(data.additionalNotes);
		await this.prsCheckbox.fill(data.prs);
	}

	async submit(): Promise<void> {
		await this.confirmButton.click();
	}
}
