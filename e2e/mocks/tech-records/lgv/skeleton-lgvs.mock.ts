import { getRandomVin } from '@/e2e/utils/tech-record.util';
import { TechRecordPUTLGVSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/lgv/skeleton';

export const SKELETON_LGV_1: TechRecordPUTLGVSkeleton = {
	vin: getRandomVin(),
	techRecord_reasonForCreation: 'Automation',
	techRecord_vehicleType: 'lgv',
	techRecord_statusCode: 'current',
};
