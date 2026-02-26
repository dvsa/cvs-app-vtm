import { getRandomVin } from '@/e2e/utils/tech-record.util';
import {
	TechRecordPUTMotorcycleComplete,
	VehicleClassDescription,
	VehicleConfiguration,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/motorcycle/complete';

export const COMPLETE_MOTORCYCLE_1: TechRecordPUTMotorcycleComplete = {
	vin: getRandomVin(),
	techRecord_reasonForCreation: 'Automation',
	techRecord_vehicleType: 'motorcycle',
	techRecord_statusCode: 'current',
	techRecord_noOfAxles: 2,
	techRecord_vehicleClass_description: 'motorbikes over 200cc or with a sidecar' as VehicleClassDescription,
	techRecord_vehicleConfiguration: 'other' as VehicleConfiguration,
	techRecord_numberOfWheelsDriven: 2,
};
