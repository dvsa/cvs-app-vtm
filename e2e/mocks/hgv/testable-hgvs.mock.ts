import {
	FitmentCode,
	TechRecordPUTHGVTestable,
	VehicleConfiguration,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/hgv/testable';

export const mockTestableHgvs: TechRecordPUTHGVTestable[] = [
	{
		techRecord_bodyType_description: 'box',
		techRecord_bodyType_code: 'b',
		techRecord_reasonForCreation: 'Automation',
		techRecord_statusCode: 'current',
		techRecord_vehicleClass_description: 'heavy goods vehicle',
		techRecord_vehicleType: 'hgv',
		techRecord_vehicleConfiguration: 'rigid' as VehicleConfiguration,
		techRecord_functionCode: 'R',
		vin: 'TESTABLEHGV1',
		techRecord_noOfAxles: 2,
		techRecord_axles: [
			{
				axleNumber: 1,
				tyres_tyreCode: 100,
				tyres_fitmentCode: 'single' as FitmentCode,
				weights_gbWeight: 1000,
				weights_eecWeight: 1000,
				weights_designWeight: 1000,
			},
			{
				axleNumber: 2,
				tyres_tyreCode: 100,
				tyres_fitmentCode: 'single' as FitmentCode,
				weights_gbWeight: 1000,
				weights_eecWeight: 1000,
				weights_designWeight: 1000,
			},
		],
	},
];
