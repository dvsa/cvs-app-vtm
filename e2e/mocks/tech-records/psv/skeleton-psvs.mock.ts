import { getRandomVin } from '@/e2e/utils/tech-record.util';
import {
	TechRecordPUTPSVSkeleton,
	VehicleClassDescription,
	VehicleConfiguration,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/psv/skeleton';

export const SKELETON_PSV_1: TechRecordPUTPSVSkeleton = {
	vin: getRandomVin(),
	techRecord_reasonForCreation: 'Automation',
	techRecord_vehicleType: 'psv',
	techRecord_statusCode: 'current',
	techRecord_vehicleConfiguration: 'rigid' as VehicleConfiguration,
	techRecord_vehicleSize: 'large',
	techRecord_seatsLowerDeck: 20,
	techRecord_seatsUpperDeck: 20,
	techRecord_vehicleClass_description: 'large psv(ie: greater than 23 seats)' as VehicleClassDescription,
	techRecord_noOfAxles: 3,
	techRecord_brakes_dtpNumber: '1000',
	techRecord_bodyType_description: 'articulated',
	techRecord_bodyMake: 'unknown',
	techRecord_chassisMake: 'unknown',
	techRecord_chassisModel: 'unknown',
};
