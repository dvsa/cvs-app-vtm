import { RUN_SEED } from '@/e2e/constants/seed';
import {
	TechRecordPUTMotorcycleComplete,
	VehicleClassDescription,
	VehicleConfiguration,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/motorcycle/complete';
import { TechRecordPUTMotorcycleSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/motorcycle/skeleton';
import { VehicleBuilder, generateVin, generateVrm } from './vehicle.builder';

export class MotorcycleBuilder extends VehicleBuilder<
	TechRecordPUTMotorcycleSkeleton | TechRecordPUTMotorcycleComplete
> {
	skeleton(): this {
		const skeleton: TechRecordPUTMotorcycleSkeleton = {
			...this.vehicle,
			vin: generateVin(RUN_SEED),
			primaryVrm: generateVrm(RUN_SEED),
			techRecord_vehicleType: 'motorcycle',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: VehicleClassDescription.MotorbikesOver200ccOrWithASidecar,
		};
		this.vehicle = skeleton;

		return this;
	}

	complete(): this {
		const complete: TechRecordPUTMotorcycleComplete = {
			...this.vehicle,

			// Skeleton fields
			vin: generateVin(RUN_SEED),
			primaryVrm: generateVrm(RUN_SEED),
			techRecord_vehicleType: 'motorcycle',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: VehicleClassDescription.MotorbikesOver200ccOrWithASidecar,

			// Complete fields
			techRecord_noOfAxles: 2,
			techRecord_numberOfWheelsDriven: 2,
			techRecord_notes: '',
			techRecord_vehicleConfiguration: VehicleConfiguration.OTHER,
		};
		this.vehicle = complete;

		return this;
	}
}
