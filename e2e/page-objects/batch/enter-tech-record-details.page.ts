import type { BatchTechnicalRecord } from '../../builders/batch.builder';
import { Button } from '../../components/button.component';
import { TechnicalRecordPage } from '../technical-record/technical-record.page';

export class EnterTechRecordDetailsPage extends TechnicalRecordPage {
	readonly heading = this.page.getByRole('heading', {
		name: 'Enter technical record details for this batch',
		exact: true,
	});
	readonly saveButton = new Button(this.page, 'save-and-process-batch-btn');
	readonly cancelLink = new Button(this.page, 'cancel-link');
	readonly summary = this.page.locator('app-batch-tech-record-details-summary-card');
	readonly trailerFormType = this.summary.locator('#trailer-form-type');
	readonly recordType = this.summary.locator('#record-type');

	async fillBatch(record: BatchTechnicalRecord): Promise<void> {
		await this.clearFilters();
		await this.generalVehicleDetails.fill({
			techRecord_vehicleConfiguration: record.techRecord_vehicleConfiguration,
			...(record.techRecord_vehicleType === 'psv'
				? { techRecord_brakes_dtpNumber: record.techRecord_brakes_dtpNumber }
				: { techRecord_bodyType_description: record.techRecord_bodyType_description }),
		});
		if (record.techRecord_vehicleType === 'psv') {
			await this.seatsAndVehicleSize.fill({
				techRecord_vehicleClass_description: record.techRecord_vehicleClass_description,
				techRecord_vehicleSize: record.techRecord_vehicleSize,
			});
		}
		await this.reasonForCreation.fillFromRecord(record);
	}
}
