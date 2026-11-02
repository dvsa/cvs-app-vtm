import type { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import type { PageFactory } from '../../page-objects/page.factory';
import { populateSkeletonTechnicalRecord } from './populate-skeleton-technical-record.workflow';
import { startTechnicalRecordCreation } from './start-technical-record-creation.workflow';
import { submitTechnicalRecord } from './submit-technical-record.workflow';

export type TestableTechnicalRecord = TechRecordType<'hgv' | 'psv' | 'trl', 'put'>;

export async function createTestableTechnicalRecord(
	pages: PageFactory,
	record: TestableTechnicalRecord
): Promise<void> {
	if (record.techRecord_statusCode !== 'current' && record.techRecord_statusCode !== 'provisional') {
		throw new Error('New technical records must be current or provisional.');
	}
	if (!record.techRecord_noOfAxles || record.techRecord_noOfAxles < 1) {
		throw new Error('Testable technical records require at least one axle.');
	}
	if (
		record.techRecord_vehicleType === 'trl' &&
		(record.techRecord_euVehicleCategory === 'o1' || record.techRecord_euVehicleCategory === 'o2')
	) {
		throw new Error('Small trailers do not support testable completeness.');
	}
	await startTechnicalRecordCreation(pages, {
		...record,
		techRecord_statusCode: record.techRecord_statusCode,
	});
	await populateSkeletonTechnicalRecord(pages, record);

	const details = pages.createTechnicalRecordDetailsPage;
	await details.generalVehicleDetails.numberOfAxlesClearAxlesButton.click();
	await details.generalVehicleDetails.fill({ techRecord_noOfAxles: record.techRecord_noOfAxles });
	await details.generalVehicleDetails.numberOfAxlesConfirmButton.click();

	if (record.techRecord_vehicleType === 'psv') {
		if (record.techRecord_seatsLowerDeck == null || record.techRecord_seatsUpperDeck == null) {
			throw new Error('Testable PSV records require upper and lower deck seat counts.');
		}
		await details.seatsAndVehicleSize.fill({
			techRecord_seatsLowerDeck: record.techRecord_seatsLowerDeck,
			techRecord_seatsUpperDeck: record.techRecord_seatsUpperDeck,
		});
	}
	await submitTechnicalRecord(pages);
}
