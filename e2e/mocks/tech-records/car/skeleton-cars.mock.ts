import { getRandomVin } from '@/e2e/utils/tech-record.util';
import { TechRecordPUTCarSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/car/skeleton';

export const SKELETON_CAR_1: TechRecordPUTCarSkeleton = {
	vin: getRandomVin(),
	techRecord_reasonForCreation: 'Automation',
	techRecord_vehicleType: 'car',
	techRecord_statusCode: 'current',
};
