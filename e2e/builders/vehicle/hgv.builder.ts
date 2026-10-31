import { RUN_SEED } from '@/e2e/constants/seed';
import {
	ApprovalType,
	EUVehicleCategory,
	TechRecordPUTHGVComplete,
	TyreUseCode,
	VehicleConfiguration,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/hgv/complete';
import { TechRecordPUTHGVSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/hgv/skeleton';
import { TechRecordPUTHGVTestable } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/hgv/testable';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { createHGVAxle } from '../helpers/axles';
import { createDocuments } from '../helpers/documents';
import { createLastApplicant } from '../helpers/last-applicant';
import { VehicleBuilder, generateVin, generateVrm } from './vehicle.builder';

export class HgvBuilder extends VehicleBuilder<TechRecordType<'hgv', 'put'>> {
	withDocuments(): this {
		this.vehicle = { ...this.vehicle, ...createDocuments() };
		return this;
	}

	withLastApplicant(): this {
		this.vehicle = { ...this.vehicle, ...createLastApplicant() };
		return this;
	}

	withEUVehicleCategory(): this {
		this.vehicle.techRecord_euVehicleCategory = EUVehicleCategory.N3;
		return this;
	}

	skeleton(): this {
		const skeleton: TechRecordPUTHGVSkeleton = {
			...this.vehicle,
			vin: generateVin(RUN_SEED),
			primaryVrm: generateVrm(RUN_SEED),
			techRecord_vehicleType: 'hgv',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: 'heavy goods vehicle',
			techRecord_bodyType_code: 'b',
			techRecord_bodyType_description: 'box',
		};
		this.vehicle = skeleton;

		return this;
	}

	testable(): this {
		const testable: TechRecordPUTHGVTestable = {
			...this.vehicle,

			// Skeleton fields
			vin: generateVin(RUN_SEED),
			primaryVrm: generateVrm(RUN_SEED),
			techRecord_vehicleType: 'hgv',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: 'heavy goods vehicle',
			techRecord_bodyType_code: 'b',
			techRecord_bodyType_description: 'box',

			// Testable fields
			techRecord_noOfAxles: 2,
			techRecord_vehicleConfiguration: VehicleConfiguration.RIGID,
			techRecord_plates: [],
			techRecord_axles: [{ axleNumber: 1 }, { axleNumber: 2 }],
		};
		this.vehicle = testable;

		return this;
	}

	complete(): this {
		const complete: TechRecordPUTHGVComplete = {
			...createDocuments(),
			...this.vehicle,
			...createLastApplicant(),

			// Skeleton fields
			vin: generateVin(RUN_SEED),
			primaryVrm: generateVrm(RUN_SEED),
			techRecord_vehicleType: 'hgv',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: 'heavy goods vehicle',
			techRecord_bodyType_code: 'b',
			techRecord_bodyType_description: 'box',

			// Testable fields
			techRecord_noOfAxles: 2,
			techRecord_vehicleConfiguration: VehicleConfiguration.RIGID,

			// Complete fields
			techRecord_approvalType: ApprovalType.ECTA,
			techRecord_manufactureYear: 2022,
			techRecord_regnDate: '2023-04-01',
			techRecord_make: 'SCANIA',
			techRecord_model: 'P370',
			techRecord_brakes_dtpNumber: '7606S',
			techRecord_euVehicleCategory: EUVehicleCategory.N3,
			techRecord_euroStandard: 'Euro 6',
			techRecord_fuelPropulsionSystem: 'Diesel',
			techRecord_speedLimiterMrk: false,
			techRecord_tachoExemptMrk: false,
			techRecord_grossGbWeight: 18000,
			techRecord_grossDesignWeight: 19500,
			techRecord_trainGbWeight: 21500,
			techRecord_maxTrainGbWeight: 21500,
			techRecord_tyreUseCode: TyreUseCode._2B,
			techRecord_dimensions_length: 10000,
			techRecord_dimensions_width: 2500,
			techRecord_frontAxleTo5thWheelMin: 0,
			techRecord_frontAxleTo5thWheelMax: 0,
			techRecord_frontAxleToRearAxle: 6000,
			techRecord_notes: '',
			techRecord_roadFriendly: false,
			techRecord_drawbarCouplingFitted: false,
			techRecord_offRoad: false,
			techRecord_axles: [createHGVAxle(1), createHGVAxle(2)],
		};
		this.vehicle = complete;

		return this;
	}
}
