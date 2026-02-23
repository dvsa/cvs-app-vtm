import {
	TechRecordPUTPSVTestable,
	VehicleClassDescription,
	VehicleConfiguration,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/psv/testable';

export const TESTABLE_PSV_1: TechRecordPUTPSVTestable = {
	vin: 'TESTABLEPSV1',
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
};
