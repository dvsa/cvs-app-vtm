import { RUN_SEED } from '@/e2e/constants/seed';
import {
	TechRecordPUTCarComplete,
	VehicleConfiguration,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/car/complete';
import { TechRecordPUTCarSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/car/skeleton';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { generateVin, generateVrm, VehicleBuilder } from './vehicle.builder';

export class CarBuilder extends VehicleBuilder<TechRecordType<'car', 'put'>> {
	skeleton(): this {
		const skeleton: TechRecordPUTCarSkeleton = {
			...this.vehicle,
			vin: generateVin(RUN_SEED),
			primaryVrm: generateVrm(RUN_SEED),
			techRecord_vehicleType: 'car',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',
		};
		this.vehicle = skeleton;

		return this;
	}

	complete(): this {
		const complete: TechRecordPUTCarComplete = {
			...this.vehicle,

			// Skeleton fields
			vin: generateVin(RUN_SEED),
			primaryVrm: generateVrm(RUN_SEED),
			techRecord_vehicleType: 'car',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',

			// Complete fields
			techRecord_noOfAxles: 2,
			techRecord_vehicleSubclass: ['a'],
			techRecord_notes: '',
			techRecord_vehicleConfiguration: VehicleConfiguration.OTHER,
		};
		this.vehicle = complete;

		return this;
	}
}
