import { RUN_SEED } from '@/e2e/constants/seed';
import {
	TechRecordPUTPSVComplete,
	VehicleClassDescription,
	VehicleConfiguration,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/psv/complete';
import { TechRecordPUTPSVSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/psv/skeleton';
import { TechRecordPUTPSVTestable } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/psv/testable';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { VehicleBuilder, generateVin, generateVrm } from './vehicle.builder';

export class PsvBuilder extends VehicleBuilder<TechRecordType<'psv', 'put'>> {
	skeleton(): this {
		const skeleton: TechRecordPUTPSVSkeleton = {
			...this.vehicle,
			vin: generateVin(RUN_SEED),
			primaryVrm: generateVrm(RUN_SEED),
			techRecord_vehicleType: 'psv',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: VehicleClassDescription.LARGE_PSV,
			techRecord_bodyType_code: 's',
			techRecord_bodyType_description: 'single decker',
			techRecord_bodyMake: 'WILLOWBROOK',
			techRecord_chassisMake: 'BEDFORD',
			techRecord_chassisModel: 'YLQ',
			techRecord_brakes_dtpNumber: '008633',
			secondaryVrms: this.vehicle.secondaryVrms ?? undefined,
		};
		this.vehicle = skeleton;

		return this;
	}

	testable(): this {
		const testable: TechRecordPUTPSVTestable = {
			...this.vehicle,

			// Skeleton fields
			vin: generateVin(RUN_SEED),
			primaryVrm: generateVrm(RUN_SEED),
			techRecord_vehicleType: 'psv',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: VehicleClassDescription.LARGE_PSV,
			techRecord_bodyType_code: 's',
			techRecord_bodyType_description: 'single decker',
			techRecord_bodyMake: 'WILLOWBROOK',
			techRecord_chassisMake: 'BEDFORD',
			techRecord_chassisModel: 'YLQ',
			techRecord_brakes_dtpNumber: '008633',

			// Testable fields
			techRecord_noOfAxles: 2,
			techRecord_vehicleConfiguration: VehicleConfiguration.RIGID,
			techRecord_vehicleSize: 'large',
			techRecord_seatsLowerDeck: 30,
			techRecord_seatsUpperDeck: 0,
			techRecord_axles: [{ axleNumber: 1 }, { axleNumber: 2 }],
		};
		this.vehicle = testable;

		return this;
	}

	complete(): this {
		const complete: TechRecordPUTPSVComplete = {
			...this.vehicle,

			// Skeleton fields
			vin: generateVin(RUN_SEED),
			primaryVrm: generateVrm(RUN_SEED),
			techRecord_vehicleType: 'psv',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: VehicleClassDescription.LARGE_PSV,
			techRecord_bodyType_code: 's',
			techRecord_bodyType_description: 'single decker',
			techRecord_bodyMake: 'WILLOWBROOK',
			techRecord_chassisMake: 'BEDFORD',
			techRecord_chassisModel: 'YLQ',
			techRecord_brakes_dtpNumber: '008633',

			// Testable fields
			techRecord_noOfAxles: 2,
			techRecord_vehicleConfiguration: VehicleConfiguration.RIGID,
			techRecord_vehicleSize: 'large',
			techRecord_seatsLowerDeck: 30,
			techRecord_seatsUpperDeck: 0,

			// Complete fields
			techRecord_standingCapacity: 0,
			techRecord_numberOfSeatbelts: '30',
			techRecord_bodyModel: 'TEST',
			techRecord_grossKerbWeight: 8000,
			techRecord_grossLadenWeight: 12000,
			techRecord_dda_certificateIssued: false,
			techRecord_brakes_brakeCode: '021122',
			techRecord_brakes_dataTrBrakeOne: '2 AXLE NO SPLIT',
			techRecord_brakes_dataTrBrakeTwo: 'HAND CONTROL AX2',
			techRecord_brakes_dataTrBrakeThree: 'AXLE 2',
			techRecord_brakes_brakeForceWheelsNotLocked_parkingBrakeForceA: 1000,
			techRecord_brakes_brakeForceWheelsNotLocked_secondaryBrakeForceA: 1000,
			techRecord_brakes_brakeForceWheelsNotLocked_serviceBrakeForceA: 2000,
			techRecord_brakes_brakeForceWheelsUpToHalfLocked_parkingBrakeForceB: 1000,
			techRecord_brakes_brakeForceWheelsUpToHalfLocked_secondaryBrakeForceB: 1000,
			techRecord_brakes_brakeForceWheelsUpToHalfLocked_serviceBrakeForceB: 2000,
			techRecord_axles: [
				{
					axleNumber: 1,
					parkingBrakeMrk: false,
					weights_gbWeight: 6000,
					weights_designWeight: 6000,
					weights_kerbWeight: 4000,
					weights_ladenWeight: 6000,
					tyres_tyreCode: 428,
					tyres_tyreSize: '315/80-22.5',
					tyres_fitmentCode: 'single',
					tyres_speedCategorySymbol: 'j',
				},
				{
					axleNumber: 2,
					parkingBrakeMrk: true,
					weights_gbWeight: 6000,
					weights_designWeight: 6000,
					weights_kerbWeight: 4000,
					weights_ladenWeight: 6000,
					tyres_tyreCode: 428,
					tyres_tyreSize: '315/80-22.5',
					tyres_fitmentCode: 'double',
					tyres_speedCategorySymbol: 'j',
				},
			],
		};
		this.vehicle = complete;

		return this;
	}
}
