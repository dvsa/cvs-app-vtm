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
		this.vehicle = { vin: generateVin(), techRecord_statusCode: 'current', ...this.vehicle, ...initialValues };
	}

	current(): this {
		this.vehicle.techRecord_statusCode = 'current';
		return this;
	}

	provisional(): this {
		this.vehicle.techRecord_statusCode = 'provisional';
		return this;
	}

	build(overrides: Partial<T> = {}): T {
		return { ...this.vehicle, ...overrides } as T;
	}
}

export function generateVin(seed?: number): string {
	if (seed === undefined) return randomUUID().replaceAll('-', '').slice(0, 17).toUpperCase();
	if (!Number.isFinite(seed)) throw new Error('VIN seed must be a finite number.');
	return createHash('sha256').update(String(seed)).digest('hex').slice(0, 17).toUpperCase();
}

export function generateVrm(seed: number = randomInt(1_000_000, 9_000_000)) {
	return String(Math.floor(1000000 + (seed % 9000000)));
}

export function generateTrailerId(seed: number = randomInt(1_000_000, 9_000_000)) {
	return String(Math.floor(1000000 + (seed % 9000000)));
}
import { createHash, randomInt, randomUUID } from 'node:crypto';
