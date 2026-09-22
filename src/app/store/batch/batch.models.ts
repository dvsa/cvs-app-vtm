import { EntityState } from '@ngrx/entity';
import { StatusCodes, TrailerFormType, VehicleTypes } from '../../models/vehicle-tech-record.model';

export type BatchState = EntityState<BatchRecord> & {
	vehicleType: VehicleTypes | null;
	vehicleStatus: StatusCodes | null;
	trlFormType: TrailerFormType | null;
	batchSize: number | null;
};

export type BatchRecord = {
	id: number;
	vin?: string;
	systemNumber?: string;
	createdTimestamp?: string;
	trailerIdOrVrm?: string;
	vehicleType?: VehicleTypes;
	status?: StatusCodes;
	created?: boolean;
	updated?: boolean;
	pending?: boolean;
	failed?: boolean;
};
