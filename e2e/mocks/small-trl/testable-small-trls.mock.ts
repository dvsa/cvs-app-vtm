import { getRandomVin } from '@/e2e/utils/tech-record.util';
import {
	EUVehicleCategory,
	TechRecordPUTTRLTestable,
	VehicleConfiguration,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/trl/testable';

export const TESTABLE_SMALL_TRL_1: TechRecordPUTTRLTestable = {
	vin: getRandomVin(),
	techRecord_reasonForCreation: 'Automation',
	techRecord_vehicleType: 'trl',
	techRecord_statusCode: 'current',
	techRecord_noOfAxles: 2,
	techRecord_bodyType_code: 'r',
	techRecord_bodyType_description: 'rigid',
	techRecord_vehicleClass_description: 'trailer',
	techRecord_vehicleConfiguration: 'semi-trailer' as VehicleConfiguration,
	techRecord_euVehicleCategory: 'o4' as EUVehicleCategory,
};
