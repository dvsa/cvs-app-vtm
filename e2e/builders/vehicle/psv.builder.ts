import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryPsv.enum.js';
import { VehicleClassDescription } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescriptionPSV.enum.js';
import { VehicleConfiguration } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationHgvPsv.enum.js';
import type { TechRecordPUTPSVComplete } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/psv/complete';
import { TechRecordPUTPSVSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/psv/skeleton';
import { TechRecordPUTPSVTestable } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/psv/testable';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { createPSVAxle } from '../helpers/axles';
import { createDocuments } from '../helpers/documents';
import { VehicleBuilder, generateVin, generateVrm } from './vehicle.builder';

export class PsvBuilder extends VehicleBuilder<TechRecordType<'psv', 'put'>> {
	withVrm(vrm = generateVrm()): this {
		this.vehicle.primaryVrm = vrm;
		return this;
	}

	withDocuments(): this {
		this.vehicle = { ...this.vehicle, ...createDocuments() };
		return this;
	}

	withEUVehicleCategory(): this {
		this.vehicle.techRecord_euVehicleCategory = EUVehicleCategory.M3;
		return this;
	}

	skeleton(): this {
		const skeleton: TechRecordPUTPSVSkeleton = {
			...this.vehicle,
			vin: this.vehicle.vin ?? generateVin(),
			techRecord_vehicleType: 'psv',
			techRecord_statusCode: this.vehicle.techRecord_statusCode ?? 'current',
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
			vin: this.vehicle.vin ?? generateVin(),
			techRecord_vehicleType: 'psv',
			techRecord_statusCode: this.vehicle.techRecord_statusCode ?? 'current',
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
			...createDocuments(),
			...this.vehicle,

			// Skeleton fields
			vin: this.vehicle.vin ?? generateVin(),
			techRecord_vehicleType: 'psv',
			techRecord_statusCode: this.vehicle.techRecord_statusCode ?? 'current',
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
			techRecord_brakes_brakeCode: '120122',
			techRecord_brakes_dataTrBrakeOne: '2 AXLE NO SPLIT',
			techRecord_brakes_dataTrBrakeTwo: 'HAND CONTROL AX2 (DESIGNATED)  OR SPLIT IF FITTED',
			techRecord_brakes_dataTrBrakeThree: 'AXLE 2',
			techRecord_brakes_brakeForceWheelsNotLocked_parkingBrakeForceA: 5400,
			techRecord_brakes_brakeForceWheelsNotLocked_secondaryBrakeForceA: 2700,
			techRecord_brakes_brakeForceWheelsNotLocked_serviceBrakeForceA: 1920,
			techRecord_brakes_brakeForceWheelsUpToHalfLocked_parkingBrakeForceB: 4000,
			techRecord_brakes_brakeForceWheelsUpToHalfLocked_secondaryBrakeForceB: 2000,
			techRecord_brakes_brakeForceWheelsUpToHalfLocked_serviceBrakeForceB: 1280,
			techRecord_axles: [createPSVAxle(1), { ...createPSVAxle(2), parkingBrakeMrk: true, tyres_fitmentCode: 'double' }],
		};
		this.vehicle = complete;

		return this;
	}
}
