import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryCar.enum.js';
import { VehicleConfiguration } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationLightVehicle.enum.js';
import type { TechRecordPUTCarComplete } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/car/complete';
import { TechRecordPUTCarSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/car/skeleton';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { createLastApplicant } from '../helpers/last-applicant';
import { VehicleBuilder, generateVin, generateVrm } from './vehicle.builder';

export class CarBuilder extends VehicleBuilder<TechRecordType<'car', 'put'>> {
	withVrm(vrm = generateVrm()): this {
		this.vehicle.primaryVrm = vrm;
		return this;
	}

	withLastApplicant(): this {
		this.vehicle = { ...this.vehicle, ...createLastApplicant() };
		return this;
	}

	withEUVehicleCategory(): this {
		this.vehicle.techRecord_euVehicleCategory = EUVehicleCategory.M1;
		return this;
	}

	skeleton(): this {
		const skeleton: TechRecordPUTCarSkeleton = {
			...this.vehicle,
			primaryVrm: this.vehicle.primaryVrm ?? undefined,
			vin: this.vehicle.vin ?? generateVin(),
			techRecord_vehicleType: 'car',
			techRecord_statusCode: this.vehicle.techRecord_statusCode ?? 'current',
			techRecord_reasonForCreation: 'Initial creation',
		};
		this.vehicle = skeleton;

		return this;
	}

	complete(): this {
		const complete: TechRecordPUTCarComplete = {
			...createLastApplicant(),
			...this.vehicle,

			// Skeleton fields
			vin: this.vehicle.vin ?? generateVin(),
			techRecord_vehicleType: 'car',
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
