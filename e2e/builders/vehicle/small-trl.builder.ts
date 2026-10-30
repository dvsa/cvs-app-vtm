import { RUN_SEED } from '@/e2e/constants/seed';
import {
	EUVehicleCategory,
	TechRecordPUTSmallTRLComplete,
	VehicleClassDescription,
	VehicleConfiguration,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/small trl/complete';
import { TechRecordPUTSmallTRLSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/small trl/skeleton';
import { VehicleBuilder, generateTrailerId, generateVin } from './vehicle.builder';

export class SmallTrlBuilder extends VehicleBuilder<TechRecordPUTSmallTRLSkeleton | TechRecordPUTSmallTRLComplete> {
	skeleton(): this {
		const skeleton: TechRecordPUTSmallTRLSkeleton = {
			...this.vehicle,
			vin: generateVin(RUN_SEED),
			trailerId: generateTrailerId(RUN_SEED),
			techRecord_vehicleType: 'trl',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: VehicleClassDescription.Trailer,
			techRecord_euVehicleCategory: EUVehicleCategory.O2,
			techRecord_vehicleSubclass: this.vehicle.techRecord_vehicleSubclass ?? undefined,
		};
		this.vehicle = skeleton;

		return this;
	}

	complete(): this {
		const complete: TechRecordPUTSmallTRLComplete = {
			...this.vehicle,

			// Skeleton fields
			vin: generateVin(RUN_SEED),
			trailerId: generateTrailerId(RUN_SEED),
			techRecord_vehicleType: 'trl',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: VehicleClassDescription.Trailer,
			techRecord_euVehicleCategory: EUVehicleCategory.O2,

			// Complete fields
			techRecord_noOfAxles: 2,
			techRecord_notes: '',
			techRecord_vehicleConfiguration: VehicleConfiguration.OTHER,
		};
		this.vehicle = complete;

		return this;
	}
}
