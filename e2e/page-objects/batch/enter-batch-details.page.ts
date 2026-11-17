import type { BatchDefinition } from '../../builders/batch.builder';
import { Button } from '../../components/button.component';
import { Radios } from '../../components/radios.component';
import { BasePage } from '../base.page';

export class EnterBatchDetailsPage extends BasePage {
	readonly heading = this.page.getByRole('heading', { name: 'Enter details for this batch', exact: true });
	readonly vehicleStatus = new Radios(this.page, 'vehicleStatus');
	readonly trailerFormType = new Radios(this.page.locator('govuk-form-group-radio#trlFormType'), 'trlFormType');
	readonly trailerFormTypeHint = this.trailerFormType.locator.getByText(
		'Trailer form type must be TES1 if vehicle status is current'
	);
	readonly tes1 = this.trailerFormType.locator.getByRole('radio', { name: 'TES1', exact: true });
	readonly tes2 = this.trailerFormType.locator.getByRole('radio', { name: 'TES2', exact: true });
	readonly continueButton = new Button(this.page, 'continue-btn');
	readonly cancelButton = new Button(this.page, 'cancel-btn');

	vehicleTypeOption(vehicleType: BatchDefinition['vehicleType']) {
		const labels = {
			hgv: 'Heavy Goods Vehicle (HGV)',
			psv: 'Public Service Vehicle (PSV)',
			trl: 'Trailer (TRL)',
		};
		// Projected vehicle-type radios do not use the shared group's ID prefix.
		return this.page.getByRole('radio', { name: labels[vehicleType], exact: true });
	}

	async fill(batch: Pick<BatchDefinition, 'vehicleType' | 'status' | 'trailerFormType'>): Promise<void> {
		await this.vehicleStatus.fill(batch.status);
		await this.vehicleTypeOption(batch.vehicleType).check();
		if (batch.vehicleType === 'trl' && batch.status === 'provisional' && batch.trailerFormType) {
			await this.trailerFormType.fill(batch.trailerFormType);
		}
	}
}
