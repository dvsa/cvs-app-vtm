import { CheckboxComponent } from '@/e2e/components/checkbox.component';
import { RadiosComponent } from '@/e2e/components/radios.component';
import { SelectComponent } from '@/e2e/components/select.component';
import { TextareaComponent } from '@/e2e/components/textarea.component';
import { getDefectIndex } from '@/e2e/utils/test-result.util';
import { DefectDetailsSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { BasePage } from '../base.page';

export class DefectPage extends BasePage {
	readonly verticalRadios = new RadiosComponent(this.page, 'vertical');
	readonly horizontalRadios = new RadiosComponent(this.page, 'horizontal');
	readonly lateralRadios = new RadiosComponent(this.page, 'lateral');
	readonly longitudinalRadios = new RadiosComponent(this.page, 'longitudinal');
	readonly rowNumberSelect = new SelectComponent(this.page, 'rowNumber');
	readonly seatNumberSelect = new SelectComponent(this.page, 'seatNumber');
	readonly axleNumberSelect = new SelectComponent(this.page, 'axleNumber');
	readonly notesTextarea = new TextareaComponent(this.page, 'notes');
	readonly prsCheckbox = new CheckboxComponent(this.page, 'prs');
	readonly prohibitionIssuedRadios = new RadiosComponent(this.page, 'prohibitionIssued');
	readonly confirmButton = this.page.getByRole('button', { name: 'Confirm' });
	readonly cancelLink = this.page.getByRole('link', { name: 'Cancel' });

	async loaded(data: DefectDetailsSchema): Promise<void> {
		await this.page.waitForURL(new RegExp(`/selectDefect/${getDefectIndex(data)}`));
		await expect(await this.page.title()).toBe('Vehicle Testing Management - Defect');
	}

	async fill(data: DefectDetailsSchema): Promise<void> {
		if (!data.additionalInformation) return;
		const location = data.additionalInformation.location;

		if (location.vertical) {
			await this.verticalRadios.fill(location.vertical);
		}

		if (location.horizontal) {
			await this.horizontalRadios.fill(location.horizontal);
		}

		if (location.lateral) {
			await this.lateralRadios.fill(location.lateral);
		}

		if (location.longitudinal) {
			await this.longitudinalRadios.fill(location.longitudinal);
		}

		if (location.rowNumber) {
			await this.rowNumberSelect.fill(location.rowNumber);
		}

		if (location.seatNumber) {
			await this.seatNumberSelect.fill(location.seatNumber);
		}

		if (location.axleNumber) {
			await this.axleNumberSelect.fill(location.axleNumber);
		}

		await this.notesTextarea.fill(data.additionalInformation.notes);
		await this.prsCheckbox.fill(data.prs);
		await this.prohibitionIssuedRadios.fill(data.prohibitionIssued);
	}

	async submit(): Promise<void> {
		await this.confirmButton.click();
	}
}
