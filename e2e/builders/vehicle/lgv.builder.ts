import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryLgv.enum.js';
import { VehicleConfiguration } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationLightVehicle.enum.js';
import type { TechRecordPUTLGVComplete } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/lgv/complete';
import { TechRecordPUTLGVSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/lgv/skeleton';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { createLastApplicant } from '../helpers/last-applicant';
import { VehicleBuilder, generateVin, generateVrm } from './vehicle.builder';

export class LgvBuilder extends VehicleBuilder<TechRecordType<'lgv', 'put'>> {
	withVrm(vrm = generateVrm()): this {
		this.vehicle.primaryVrm = vrm;
		return this;
	}

	withLastApplicant(): this {
		this.vehicle = { ...this.vehicle, ...createLastApplicant() };
		return this;
	}

	withEUVehicleCategory(): this {
		this.vehicle.techRecord_euVehicleCategory = EUVehicleCategory.N1;
		return this;
	}

	skeleton(): this {
		const skeleton: TechRecordPUTLGVSkeleton = {
			...this.vehicle,
			vin: this.vehicle.vin ?? generateVin(),
			techRecord_vehicleType: 'lgv',
			techRecord_statusCode: this.vehicle.techRecord_statusCode ?? 'current',
			techRecord_reasonForCreation: 'Initial creation',
		};
		this.vehicle = skeleton;

		return this;
	}

	complete(): this {
		const complete: TechRecordPUTLGVComplete = {
			...createLastApplicant(),
			...this.vehicle,

			// Skeleton fields
			vin: this.vehicle.vin ?? generateVin(),
			techRecord_vehicleType: 'lgv',
			techRecord_statusCode: this.vehicle.techRecord_statusCode ?? 'current',
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
