import type {
	TechRecordPUTHGVSkeleton,
	VehicleConfiguration,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/hgv/skeleton';

export const mockSkeletonHgvs: TechRecordPUTHGVSkeleton[] = [
	{
		techRecord_bodyType_description: 'box',
		techRecord_bodyType_code: 'b',
		techRecord_reasonForCreation: 'Automation',
		techRecord_statusCode: 'current',
		techRecord_vehicleClass_description: 'heavy goods vehicle',
		techRecord_vehicleType: 'hgv',
		techRecord_vehicleConfiguration: 'rigid' as VehicleConfiguration,
		techRecord_functionCode: 'R',
		vin: 'AUTOMATIONHGV1',
	},
	{
		techRecord_bodyType_description: 'articulated',
		techRecord_bodyType_code: 'a',
		techRecord_reasonForCreation: 'Automation',
		techRecord_statusCode: 'current',
		techRecord_vehicleClass_description: 'heavy goods vehicle',
		techRecord_vehicleType: 'hgv',
		techRecord_vehicleConfiguration: 'articulated' as VehicleConfiguration,
		techRecord_functionCode: 'A',
		vin: 'AUTOMATIONHGV2',
	},
];
