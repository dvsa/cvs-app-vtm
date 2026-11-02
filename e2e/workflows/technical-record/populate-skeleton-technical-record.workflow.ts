import type { TechRecordPUTMotorcycleSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/motorcycle/skeleton';
import type { TechRecordPUTSmallTRLComplete } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/small trl/complete';
import type { TechRecordPUTSmallTRLSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/small trl/skeleton';
import type { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import type { PageFactory } from '../../page-objects/page.factory';

export type SkeletonTechnicalRecord =
	| TechRecordType<'put'>
	| TechRecordPUTMotorcycleSkeleton
	| TechRecordPUTSmallTRLSkeleton
	| TechRecordPUTSmallTRLComplete;

export async function populateSkeletonTechnicalRecord(
	pages: PageFactory,
	record: SkeletonTechnicalRecord
): Promise<void> {
	const details = pages.createTechnicalRecordDetailsPage;
	switch (record.techRecord_vehicleType) {
		case 'hgv':
			if (!record.techRecord_vehicleConfiguration || !record.techRecord_bodyType_description) {
				throw new Error('HGV skeleton creation requires a configuration and body type.');
			}
			await details.generalVehicleDetails.fill({
				techRecord_vehicleConfiguration: record.techRecord_vehicleConfiguration,
				techRecord_bodyType_description: record.techRecord_bodyType_description,
			});
			break;
		case 'psv':
			if (
				!record.techRecord_vehicleConfiguration ||
				!record.techRecord_brakes_dtpNumber ||
				!record.techRecord_vehicleClass_description ||
				!record.techRecord_vehicleSize
			) {
				throw new Error('PSV skeleton creation requires configuration, DTp number, vehicle class and size.');
			}
			await details.generalVehicleDetails.fill({
				techRecord_brakes_dtpNumber: record.techRecord_brakes_dtpNumber,
				techRecord_vehicleConfiguration: record.techRecord_vehicleConfiguration,
			});
			await details.seatsAndVehicleSize.fill({
				techRecord_vehicleClass_description: record.techRecord_vehicleClass_description,
				techRecord_vehicleSize: record.techRecord_vehicleSize,
			});
			break;
		case 'trl':
			if (record.techRecord_euVehicleCategory === 'o1' || record.techRecord_euVehicleCategory === 'o2') {
				await details.generalVehicleDetails.fill({
					techRecord_euVehicleCategory: record.techRecord_euVehicleCategory,
				});
			} else {
				if (
					!record.techRecord_vehicleConfiguration ||
					!('techRecord_bodyType_description' in record) ||
					!record.techRecord_bodyType_description
				) {
					throw new Error('Trailer skeleton creation requires a configuration and body type.');
				}
				await details.generalVehicleDetails.fill({
					techRecord_vehicleConfiguration: record.techRecord_vehicleConfiguration,
					techRecord_bodyType_description: record.techRecord_bodyType_description,
				});
			}
			break;
		case 'motorcycle':
			if (!record.techRecord_vehicleClass_description) {
				throw new Error('Motorcycle skeleton creation requires a vehicle class.');
			}
			await details.generalVehicleDetails.fill({
				techRecord_vehicleClass_description: record.techRecord_vehicleClass_description,
			});
			break;
	}
	await details.generalVehicleDetails.open();
	await details.generalVehicleDetails.numberOfAxlesConfirmButton.click();
	await details.reasonForCreation.fill({ techRecord_reasonForCreation: record.techRecord_reasonForCreation });
}
