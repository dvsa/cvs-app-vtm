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
import { VehicleBuilder, generateVin, generateVrm } from './vehicle.builder';

export class HgvBuilder extends VehicleBuilder<TechRecordType<'hgv', 'put'>> {
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
			techRecord_applicantDetails_name: 'Test Applicant',
			techRecord_applicantDetails_address1: '1 Test Street',
			techRecord_applicantDetails_address2: 'Test Estate',
			techRecord_applicantDetails_postTown: 'Swansea',
			techRecord_axles: [
				{
					axleNumber: 1,
					weights_gbWeight: 8000,
					weights_designWeight: 8000,
					tyres_tyreCode: 428,
					tyres_tyreSize: '315/80-22.5',
					tyres_fitmentCode: 'single',
				},
				{
					axleNumber: 2,
					weights_gbWeight: 10000,
					weights_designWeight: 11500,
					tyres_tyreCode: 428,
					tyres_tyreSize: '315/80-22.5',
					tyres_fitmentCode: 'double',
				},
			],
		};
		this.vehicle = complete;

		return this;
	}
}
