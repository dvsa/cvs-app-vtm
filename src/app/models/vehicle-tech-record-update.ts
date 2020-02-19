import { TechRecord } from '@app/models/tech-record.model';
import { UserDetails } from '@app/models/user-details';

export interface VehicleTechRecordUpdate {
  systemNumber: string;
  techRecord: TechRecord[];
  msUserDetails: UserDetails;
}
