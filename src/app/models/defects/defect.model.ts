import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { AdditionalInformation } from './additional-information.model';
import { Item } from './item.model';

export interface Defect {
  additionalInfo: AdditionalInformation;
  forVehicleType: VehicleTypes[];
  imDescription: string;
  imNumber: number;
  items: Item[];
}
