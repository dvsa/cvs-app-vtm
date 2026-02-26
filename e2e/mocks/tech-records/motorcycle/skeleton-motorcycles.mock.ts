import { getRandomVin } from '@/e2e/utils/tech-record.util';
import {
	TechRecordPUTMotorcycleSkeleton,
	VehicleClassDescription,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/motorcycle/skeleton';

export const SKELETON_MOTORCYCLE_1: TechRecordPUTMotorcycleSkeleton = {
	vin: getRandomVin(),
	techRecord_reasonForCreation: 'Automation',
	techRecord_vehicleType: 'motorcycle',
	techRecord_statusCode: 'current',
	techRecord_vehicleClass_description: 'motorbikes over 200cc or with a sidecar' as VehicleClassDescription,
};
