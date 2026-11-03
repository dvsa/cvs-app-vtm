import type { PageFactory } from '../../page-objects/page.factory';
import type { TechnicalRecord } from '../../page-objects/technical-record/technical-record.page';
import { startTechnicalRecordCreation } from './start-technical-record-creation.workflow';
import { submitTechnicalRecord } from './submit-technical-record.workflow';

export async function createTechnicalRecord(pages: PageFactory, record: TechnicalRecord): Promise<void> {
	if (record.techRecord_statusCode !== 'current' && record.techRecord_statusCode !== 'provisional') {
		throw new Error('New technical records must be current or provisional.');
	}
	await startTechnicalRecordCreation(pages, {
		...record,
		techRecord_statusCode: record.techRecord_statusCode,
		techRecord_vehicleType:
			record.techRecord_vehicleType === 'trl' &&
			(record.techRecord_euVehicleCategory === 'o1' || record.techRecord_euVehicleCategory === 'o2')
				? 'small trl'
				: record.techRecord_vehicleType,
	});
	await pages.createTechnicalRecordDetailsPage.fill(record);
	await submitTechnicalRecord(pages);
}
