import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryTrl.enum.js';
import { TyreUseCode } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tyreUseCodeTrl.enum.js';
import { VehicleConfiguration } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationTrl.enum.js';
import type { TechRecordPUTTRLComplete } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/trl/complete';
import { TechRecordPUTTRLSkeleton } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/trl/skeleton';
import { TechRecordPUTTRLTestable } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/trl/testable';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { createTRLAxle } from '../helpers/axles';
import { createDocuments } from '../helpers/documents';
import { createLastApplicant } from '../helpers/last-applicant';
import { createManufacturer } from '../helpers/manufacturer';
import { createPurchaser } from '../helpers/purchaser';
import { VehicleBuilder, generateTrailerId, generateVin } from './vehicle.builder';

export class TrlBuilder extends VehicleBuilder<TechRecordType<'trl', 'put'>> {
	withTrailerId(trailerId = generateTrailerId()): this {
		this.vehicle.trailerId = trailerId;
		return this;
	}

	withDocuments(): this {
		this.vehicle = { ...this.vehicle, ...createDocuments() };
		return this;
	}

	withManufacturer(): this {
		this.vehicle = { ...this.vehicle, ...createManufacturer() };
		return this;
	}

	withPurchasers(): this {
		this.vehicle = { ...this.vehicle, ...createPurchaser() };
		return this;
	}

	withLastApplicant(): this {
		this.vehicle = { ...this.vehicle, ...createLastApplicant() };
		return this;
	}

	withEUVehicleCategory(): this {
		this.vehicle.techRecord_euVehicleCategory = EUVehicleCategory.O4;
		return this;
	}

	skeleton(): this {
		const skeleton: TechRecordPUTTRLSkeleton = {
			...this.vehicle,
			vin: this.vehicle.vin ?? generateVin(),
			techRecord_vehicleType: 'trl',
			techRecord_statusCode: this.vehicle.techRecord_statusCode ?? 'current',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: 'trailer',
			techRecord_bodyType_code: 'b',
			techRecord_bodyType_description: 'box',
			techRecord_plates: this.vehicle.techRecord_plates ?? [],
			techRecord_hiddenInVta: this.vehicle.techRecord_hiddenInVta ?? undefined,
			techRecord_updateType: this.vehicle.techRecord_updateType ?? undefined,
		};
		this.vehicle = skeleton;

		return this;
	}

	testable(): this {
		const testable: TechRecordPUTTRLTestable = {
			...this.vehicle,

			// Skeleton fields
			vin: this.vehicle.vin ?? generateVin(),
			techRecord_vehicleType: 'trl',
			techRecord_statusCode: this.vehicle.techRecord_statusCode ?? 'current',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: 'trailer',
			techRecord_bodyType_code: 'b',
			techRecord_bodyType_description: 'box',
			techRecord_hiddenInVta: this.vehicle.techRecord_hiddenInVta ?? undefined,
			techRecord_updateType: this.vehicle.techRecord_updateType ?? undefined,

			// Testable fields
			techRecord_noOfAxles: 2,
			techRecord_vehicleConfiguration: VehicleConfiguration.SEMI_TRAILER,
			techRecord_plates: [],
			techRecord_axles: [{ axleNumber: 1 }, { axleNumber: 2 }],
		};
		this.vehicle = testable;

		return this;
	}

	complete(): this {
		const complete: TechRecordPUTTRLComplete = {
			...createDocuments(),
			...createLastApplicant(),
			...createManufacturer(),
			...createPurchaser(),
			...this.vehicle,

			// Skeleton fields
			vin: this.vehicle.vin ?? generateVin(),
			techRecord_vehicleType: 'trl',
			techRecord_statusCode: this.vehicle.techRecord_statusCode ?? 'current',
			techRecord_reasonForCreation: 'Initial creation',
			techRecord_vehicleClass_description: 'trailer',
			techRecord_bodyType_code: 'b',
			techRecord_bodyType_description: 'box',

			// Testable fields
			techRecord_noOfAxles: 2,
			techRecord_vehicleConfiguration: VehicleConfiguration.SEMI_TRAILER,

			// Complete fields
			techRecord_make: 'SCHMITZ',
			techRecord_model: 'CARGOBULL',
			techRecord_firstUseDate: '2023-04-01',
			techRecord_euVehicleCategory: EUVehicleCategory.O4,
			techRecord_dimensions_length: 13600,
			techRecord_dimensions_width: 2500,
			techRecord_couplingCenterToRearAxleMin: 8000,
			techRecord_couplingCenterToRearAxleMax: 8000,
			techRecord_couplingCenterToRearTrlMin: 12000,
			techRecord_couplingCenterToRearTrlMax: 12000,
			techRecord_couplingType: 'S',
			techRecord_maxLoadOnCoupling: 10000,
			techRecord_roadFriendly: true,
			techRecord_suspensionType: 'A',
			techRecord_tyreUseCode: TyreUseCode._2B,
			techRecord_notes: 'Complete trailer record',
			techRecord_axles: [createTRLAxle(1), createTRLAxle(2)],
		};
		this.vehicle = complete;

		return this;
	}
}
