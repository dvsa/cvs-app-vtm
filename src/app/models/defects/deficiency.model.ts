import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { deficiencyCategory } from './deficiency-category.enum';

export interface Deficiency {
	deficiencyCategory: deficiencyCategory;
	deficiencyId: string;
	deficiencySubId: string;
	deficiencyText: string;
	forVehicleType: VehicleTypes[];
	ref: string;
	stdForProhibition: boolean;
}
