import { getRandomVin } from '@/e2e/utils/tech-record.util';
import {
	TechRecordPUTTRLSkeleton,
	VehicleConfiguration,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/trl/skeleton';

export const SKELETON_TRL_1: TechRecordPUTTRLSkeleton = {
	vin: getRandomVin(),
	techRecord_reasonForCreation: 'Automation',
	techRecord_vehicleType: 'trl',
	techRecord_statusCode: 'current',
	techRecord_noOfAxles: 2,
	techRecord_bodyType_code: 'r',
	techRecord_bodyType_description: 'rigid',
	techRecord_vehicleClass_description: 'trailer',
	techRecord_vehicleConfiguration: 'semi-trailer' as VehicleConfiguration,
};
