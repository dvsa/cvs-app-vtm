import { RUN_SEED } from '@/e2e/constants/seed';
import {
	TechRecordPUTLGVComplete,
	VehicleConfiguration,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/lgv/complete';
import { TechRecordPUTLGVSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/lgv/skeleton';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { VehicleBuilder, generateVin, generateVrm } from './vehicle.builder';

export class LgvBuilder extends VehicleBuilder<TechRecordType<'lgv', 'put'>> {
	skeleton(): this {
		const skeleton: TechRecordPUTLGVSkeleton = {
			...this.vehicle,
			vin: generateVin(RUN_SEED),
			primaryVrm: generateVrm(RUN_SEED),
			techRecord_vehicleType: 'lgv',
			techRecord_statusCode: 'provisional',
			techRecord_reasonForCreation: 'Initial creation',
		};
		this.vehicle = skeleton;

		return this;
	}

	complete(): this {
		const complete: TechRecordPUTLGVComplete = {
			...this.vehicle,

			// Skeleton fields
			vin: generateVin(RUN_SEED),
			primaryVrm: generateVrm(RUN_SEED),
			techRecord_vehicleType: 'lgv',
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
