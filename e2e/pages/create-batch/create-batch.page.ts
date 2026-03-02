import { RadiosComponent } from '@/e2e/components/radios.component';
import { BasePage } from '../base.page';

export class CreateBatchPage extends BasePage {
	readonly vehicleTypeRadios = new RadiosComponent(this.page, 'vehicle-type');
	readonly trlFormTypeRadios = new RadiosComponent(this.page, 'tes1-tes2');
	readonly continueButton = this.page.getByRole('button', { name: 'Continue' });
	readonly backLink = this.page.getByRole('link', { name: 'Back' });

	async fill(data: Partial<CreateBatchForm>): Promise<void> {
		await this.vehicleTypeRadios.fill(data.vehicleType);
		if (data.vehicleType === 'trl') {
			await this.trlFormTypeRadios.fill(data.trailerFormType);
		}
	}
}

export type CreateBatchFormHgv = {
	vehicleType: 'hgv';
};

export type CreateBatchFormPsv = {
	vehicleType: 'psv';
};

export type CreateBatchFormTrl = {
	vehicleType: 'trl';
	trailerFormType: 'tes1' | 'tes2';
};

export type CreateBatchForm = CreateBatchFormHgv | CreateBatchFormPsv | CreateBatchFormTrl;
