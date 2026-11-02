import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategorySmallTrl.enum.js';
import { VehicleClassDescription } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescription.enum.js';
import { VehicleConfiguration } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationLightVehicle.enum.js';
import type { TechRecordPUTSmallTRLComplete } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/small trl/complete';
import { TechRecordPUTSmallTRLSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/small trl/skeleton';
import { createLastApplicant } from '../helpers/last-applicant';
import { VehicleBuilder, generateTrailerId, generateVin } from './vehicle.builder';

export class SmallTrlBuilder extends VehicleBuilder<TechRecordPUTSmallTRLSkeleton | TechRecordPUTSmallTRLComplete> {
	withTrailerId(trailerId = generateTrailerId()): this {
		this.vehicle.trailerId = trailerId;
		return this;
	}

	withLastApplicant(): this {
		this.vehicle = { ...this.vehicle, ...createLastApplicant() };
		return this;
	}

	withEUVehicleCategory(): this {
		this.vehicle.techRecord_euVehicleCategory = EUVehicleCategory.O2;
		return this;
	}

	skeleton(): this {
		const skeleton: TechRecordPUTSmallTRLSkeleton = {
			...this.vehicle,
			vin: this.vehicle.vin ?? generateVin(),
			techRecord_vehicleType: 'trl',
			techRecord_statusCode: this.vehicle.techRecord_statusCode ?? 'current',
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
			...createLastApplicant(),
			...this.vehicle,

			// Skeleton fields
			vin: this.vehicle.vin ?? generateVin(),
			techRecord_vehicleType: 'trl',
			techRecord_statusCode: this.vehicle.techRecord_statusCode ?? 'current',
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
