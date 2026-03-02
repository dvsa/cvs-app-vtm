import { RadiosComponent } from '@/e2e/components/radios.component';
import { BasePage } from '../base.page';

export class AmendTechRecordReasonPage extends BasePage {
	readonly reasonRadios = new RadiosComponent(this.page);
	readonly backLink = this.page.getByRole('link', { name: 'Back' });
	readonly continueButton = this.page.getByRole('button', { name: 'Continue' });

	async loaded(): Promise<void> {
		await this.page.waitForURL(new RegExp('/amend-reason'));
		expect(await this.page.title()).toBe('Vehicle Testing Management - Tech Record');
	}

	async fill(data: Partial<AmendTechRecordReasonForm>): Promise<void> {
		await this.reasonRadios.fill(data.reason);
	}

	async submit(): Promise<void> {
		await this.continueButton.click();
	}
}

export type AmendTechRecordReasonForm = {
	reason: 'correcting-an-error' | 'notifiable-alteration-needed';
};
