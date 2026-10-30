import { RUN_SEED } from '@/e2e/constants/seed';
import {
	EUVehicleCategory,
	TechRecordPUTTRLComplete,
	TyreUseCode,
	VehicleConfiguration,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/trl/complete';
import { TechRecordPUTTRLSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/trl/skeleton';
import { TechRecordPUTTRLTestable } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/trl/testable';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { VehicleBuilder, generateTrailerId, generateVin } from './vehicle.builder';

export class TrlBuilder extends VehicleBuilder<TechRecordType<'trl', 'put'>> {
	skeleton(): this {
		const skeleton: TechRecordPUTTRLSkeleton = {
			...this.vehicle,
			vin: generateVin(RUN_SEED),
			trailerId: generateTrailerId(RUN_SEED),
			techRecord_vehicleType: 'trl',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: 'trailer',
			techRecord_bodyType_code: 'b',
			techRecord_bodyType_description: 'box',
			techRecord_plates: this.vehicle.techRecord_plates ?? [],
			techRecord_hiddenInVta: this.vehicle.techRecord_hiddenInVta ?? undefined,
			techRecord_updateType: this.vehicle.techRecord_updateType ?? undefined,
		};
		this.vehicle = skeleton;

		return this;
	}

	testable(): this {
		const testable: TechRecordPUTTRLTestable = {
			...this.vehicle,

			// Skeleton fields
			vin: generateVin(RUN_SEED),
			trailerId: generateTrailerId(RUN_SEED),
			techRecord_vehicleType: 'trl',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: 'trailer',
			techRecord_bodyType_code: 'b',
			techRecord_bodyType_description: 'box',
			techRecord_hiddenInVta: this.vehicle.techRecord_hiddenInVta ?? undefined,
			techRecord_updateType: this.vehicle.techRecord_updateType ?? undefined,

			// Testable fields
			techRecord_noOfAxles: 2,
			techRecord_vehicleConfiguration: VehicleConfiguration.SEMI_TRAILER,
			techRecord_plates: [],
			techRecord_axles: [{ axleNumber: 1 }, { axleNumber: 2 }],
		};
		this.vehicle = testable;

		return this;
	}

	complete(): this {
		const complete: TechRecordPUTTRLComplete = {
			...this.vehicle,

			// Skeleton fields
			vin: generateVin(RUN_SEED),
			trailerId: generateTrailerId(RUN_SEED),
			techRecord_vehicleType: 'trl',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: 'trailer',
			techRecord_bodyType_code: 'b',
			techRecord_bodyType_description: 'box',

			// Testable fields
			techRecord_noOfAxles: 2,
			techRecord_vehicleConfiguration: VehicleConfiguration.SEMI_TRAILER,

			// Complete fields
			techRecord_make: 'SCHMITZ',
			techRecord_model: 'CARGOBULL',
			techRecord_firstUseDate: '2023-04-01',
			techRecord_euVehicleCategory: EUVehicleCategory.O4,
			techRecord_dimensions_length: 13600,
			techRecord_dimensions_width: 2500,
			techRecord_couplingCenterToRearAxleMin: 8000,
			techRecord_couplingCenterToRearAxleMax: 8000,
			techRecord_couplingCenterToRearTrlMin: 12000,
			techRecord_couplingCenterToRearTrlMax: 12000,
			techRecord_couplingType: 'SEMI',
			techRecord_maxLoadOnCoupling: 10000,
			techRecord_roadFriendly: true,
			techRecord_suspensionType: 'air',
			techRecord_tyreUseCode: TyreUseCode._2B,
			techRecord_notes: '',
			techRecord_axles: [
				{
					axleNumber: 1,
					parkingBrakeMrk: true,
					brakes_brakeActuator: 20,
					brakes_leverLength: 150,
					weights_gbWeight: 9000,
					weights_designWeight: 9000,
					tyres_tyreCode: 428,
					tyres_tyreSize: '315/80-22.5',
					tyres_fitmentCode: 'single',
				},
				{
					axleNumber: 2,
					parkingBrakeMrk: true,
					brakes_brakeActuator: 20,
					brakes_leverLength: 150,
					weights_gbWeight: 9000,
					weights_designWeight: 9000,
					tyres_tyreCode: 428,
					tyres_tyreSize: '315/80-22.5',
					tyres_fitmentCode: 'single',
				},
			],
		};
		this.vehicle = complete;

		return this;
	}
}
