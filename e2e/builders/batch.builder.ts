import { VehicleClassDescription } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescriptionPSV.enum.js';
import { VehicleConfiguration } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationHgvPsv.enum.js';
import { VehicleConfiguration as TrailerConfiguration } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationTrl.enum.js';
import type { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { HgvBuilder } from './vehicle/hgv.builder';
import { PsvBuilder } from './vehicle/psv.builder';
import { TrlBuilder } from './vehicle/trl.builder';
import { generateVin } from './vehicle/vehicle.builder';

export type BatchVehicleType = 'hgv' | 'psv' | 'trl';
export type BatchStatus = 'current' | 'provisional';
export type TrailerFormType = 'tes1' | 'tes2';
export type BatchTechnicalRecord = TechRecordType<BatchVehicleType, 'put'>;

export interface BatchVehicle {
	vin: string;
	trailerIdOrVrm?: string;
}

export interface BatchDefinition {
	vehicleType: BatchVehicleType;
	status: BatchStatus;
	trailerFormType?: TrailerFormType;
	vehicles: BatchVehicle[];
	record: BatchTechnicalRecord;
}

export class BatchBuilder {
	private status: BatchStatus = 'current';
	private trailerFormType: TrailerFormType = 'tes1';
	private vehicles: BatchVehicle[] = [];

	constructor(private readonly vehicleType: BatchVehicleType) {}

	current(): this {
		this.status = 'current';
		return this;
	}

	provisional(): this {
		this.status = 'provisional';
		return this;
	}

	withTrailerFormType(formType: TrailerFormType): this {
		if (this.vehicleType !== 'trl') throw new Error('Only trailer batches have a trailer form type.');
		this.trailerFormType = formType;
		return this;
	}

	withSize(size: number): this {
		if (!Number.isInteger(size) || size < 1 || size > 41) throw new Error('Batch size must be between 1 and 41.');
		this.vehicles = Array.from({ length: size }, () => ({ vin: generateVin() }));
		return this;
	}

	withVehicles(vehicles: BatchVehicle[]): this {
		this.vehicles = vehicles.map((vehicle) => ({ ...vehicle }));
		return this;
	}

	build(): BatchDefinition {
		if (this.vehicles.length < 1 || this.vehicles.length > 41) throw new Error('Batch size must be between 1 and 41.');
		if (this.vehicleType === 'trl' && this.status === 'current' && this.trailerFormType !== 'tes1') {
			throw new Error('Current trailer batches must use TES1.');
		}
		return {
			vehicleType: this.vehicleType,
			status: this.status,
			trailerFormType: this.vehicleType === 'trl' ? this.trailerFormType : undefined,
			vehicles: this.vehicles.map((vehicle) => ({ ...vehicle })),
			record: this.createTemplate(),
		};
	}

	private createTemplate(): BatchTechnicalRecord {
		const common = {
			techRecord_statusCode: this.status,
			techRecord_reasonForCreation: 'E2E batch technical record',
		};
		switch (this.vehicleType) {
			case 'hgv':
				return new HgvBuilder().skeleton().build({
					...common,
					techRecord_vehicleConfiguration: VehicleConfiguration.ARTICULATED,
					techRecord_bodyType_code: 'a',
					techRecord_bodyType_description: 'articulated',
				});
			case 'psv':
				return new PsvBuilder().skeleton().build({
					...common,
					techRecord_vehicleConfiguration: VehicleConfiguration.ARTICULATED,
					techRecord_vehicleClass_description: VehicleClassDescription.SMALL_PSV,
					techRecord_vehicleSize: 'small',
					techRecord_brakes_dtpNumber: '000000',
				});
			case 'trl':
				return new TrlBuilder().skeleton().build({
					...common,
					techRecord_vehicleConfiguration: TrailerConfiguration.CENTRE_AXLE_DRAWBAR,
				});
		}
	}
}
