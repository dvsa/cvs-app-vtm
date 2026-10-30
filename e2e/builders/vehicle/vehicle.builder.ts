import { TechRecordPUTMotorcycleSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/motorcycle/skeleton';
import { TechRecordPUTSmallTRLComplete } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/small trl/complete';
import { TechRecordPUTSmallTRLSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/small trl/skeleton';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';

export abstract class VehicleBuilder<
	T extends
		| TechRecordType<'put'>
		| TechRecordPUTMotorcycleSkeleton
		| TechRecordPUTSmallTRLSkeleton
		| TechRecordPUTSmallTRLComplete,
> {
	vehicle: Partial<T> = {};

	constructor(initialValues: Partial<T> = {}) {
		this.vehicle = { ...this.vehicle, ...initialValues };
	}

	build(overrides: Partial<T> = {}): T {
		return { ...this.vehicle, ...overrides } as T;
	}
}

export function generateVin(seed: number = Math.random()) {
	return String(Math.floor(1000000 + (seed % 9000000000)));
}

export function generateVrm(seed: number = Math.random()) {
	return String(Math.floor(1000000 + (seed % 9000000)));
}

export function generateTrailerId(seed: number = Math.random()) {
	return String(Math.floor(1000000 + (seed % 9000000)));
}
