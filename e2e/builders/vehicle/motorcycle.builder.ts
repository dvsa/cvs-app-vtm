import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { VehicleClassDescription } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescription.enum.js';
import { VehicleConfiguration } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationLightVehicle.enum.js';
import type { TechRecordPUTMotorcycleComplete } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/motorcycle/complete';
import { TechRecordPUTMotorcycleSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/motorcycle/skeleton';
import { createLastApplicant } from '../helpers/last-applicant';
import { VehicleBuilder, generateVin, generateVrm } from './vehicle.builder';

export class MotorcycleBuilder extends VehicleBuilder<
	TechRecordPUTMotorcycleSkeleton | TechRecordPUTMotorcycleComplete
> {
	withVrm(vrm = generateVrm()): this {
		this.vehicle.primaryVrm = vrm;
		return this;
	}

	withLastApplicant(): this {
		this.vehicle = { ...this.vehicle, ...createLastApplicant() };
		return this;
	}

	withEUVehicleCategory(): this {
		this.vehicle.techRecord_euVehicleCategory = EUVehicleCategory.L3E;
		return this;
	}

	skeleton(): this {
		const skeleton: TechRecordPUTMotorcycleSkeleton = {
			...this.vehicle,
			vin: this.vehicle.vin ?? generateVin(),
			techRecord_vehicleType: 'motorcycle',
			techRecord_statusCode: this.vehicle.techRecord_statusCode ?? 'current',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: VehicleClassDescription.MotorbikesOver200ccOrWithASidecar,
		};
		this.vehicle = skeleton;

		return this;
	}

	complete(): this {
		const complete: TechRecordPUTMotorcycleComplete = {
			...createLastApplicant(),
			...this.vehicle,

			// Skeleton fields
			vin: this.vehicle.vin ?? generateVin(),
			techRecord_vehicleType: 'motorcycle',
			techRecord_statusCode: this.vehicle.techRecord_statusCode ?? 'current',
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
