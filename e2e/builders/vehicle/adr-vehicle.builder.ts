import { ADRBodyDeclarationTypes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyDeclarationType.enum.js';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ADRCompatibilityGroupJ } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrCompatibilityGroupJ.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import type { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { type AdrDetails, createADRBatteryDetails, createADRDetails, createADRTankDetails } from '../helpers/adr';
import { VehicleBuilder } from './vehicle.builder';

export abstract class AdrVehicleBuilder<
	T extends TechRecordType<'hgv' | 'lgv' | 'trl', 'put'>,
> extends VehicleBuilder<T> {
	withAdrDetails(overrides: AdrDetails = {}): this {
		this.vehicle = { ...this.vehicle, ...createADRDetails(), ...overrides };
		return this;
	}

	withTankDetails(overrides: AdrDetails = {}): this {
		this.vehicle = { ...this.vehicle, ...createADRTankDetails(), ...overrides };
		return this;
	}

	withBatteryDetails(overrides: AdrDetails = {}): this {
		this.vehicle = { ...this.vehicle, ...createADRBatteryDetails(), ...overrides };
		return this;
	}

	withExplosives(overrides: AdrDetails = {}): this {
		this.vehicle = {
			...this.vehicle,
			techRecord_adrDetails_vehicleDetails_type: ADRBodyType.RIGID_BOX_BODY,
			techRecord_adrDetails_permittedDangerousGoods: [ADRDangerousGood.EXPLOSIVES_TYPE_3],
			techRecord_adrDetails_compatibilityGroupJ: ADRCompatibilityGroupJ.I,
			techRecord_adrDetails_bodyDeclaration_type: ADRBodyDeclarationTypes.ON_OR_AFTER_1ST_JULY_2005,
			...overrides,
		};
		return this;
	}

	withOperatorDeclaration(): this {
		this.vehicle.techRecord_adrDetails_declarationsSeen = true;
		return this;
	}
}
