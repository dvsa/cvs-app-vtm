import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Deficiency } from './deficiency.model';

export interface Item {
	deficiencies: Deficiency[];
	forVehicleType: VehicleTypes[];
	itemDescription: string;
	itemNumber: number;
}
