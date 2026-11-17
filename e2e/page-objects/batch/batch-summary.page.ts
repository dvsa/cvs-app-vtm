import { Button } from '../../components/button.component';
import { BasePage } from '../base.page';
import { ViewTechnicalRecordPage } from '../technical-record/view-technical-record.page';

export class BatchSummaryPage extends BasePage {
	readonly heading = this.page.getByRole('heading', { name: 'Batch summary', exact: true });
	readonly successBanner = this.page.locator('#batch-success-banner');
	readonly progressBanner = this.page.locator('#batch-progress-banner');
	readonly successfulRecords = this.page.locator('.govuk-summary-list__row[id^="vehicle-"]');
	readonly failedRecords = this.page.locator('.govuk-summary-list__row[id^="failed-vehicle-"]');
	readonly retryButton = new Button(this.page, 'retry-failed-btn');
	readonly homeButton = new Button(this.page, 'go-back-to-homepage-btn');

	successfulRecord(vin: string) {
		return this.successfulRecords.filter({ has: this.page.getByText(vin, { exact: true }) });
	}

	recordStatus(vin: string) {
		return this.successfulRecord(vin).locator('[id$="-status"]');
	}

	async openRecord(vin: string): Promise<ViewTechnicalRecordPage> {
		const [recordPage] = await Promise.all([
			this.page.waitForEvent('popup'),
			this.successfulRecord(vin).getByRole('link', { name: /^View/ }).click(),
		]);
		return new ViewTechnicalRecordPage(recordPage);
	}
}
