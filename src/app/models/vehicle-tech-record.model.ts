import { VrmModel } from '@app/models/vrm.model';
import { TechRecord } from '@app/models/tech-record.model';
import { MetaData } from './meta-data';
import { UserDetails } from './user-details';
import { VIEW_STATE } from '@app/app.enums';

export interface VehicleTechRecordModel {
  vrms: VrmModel[];
  vin: string;
  trailerId?: string;
  systemNumber: string;
  techRecord: TechRecord[];
  metadata: MetaData;
}

export interface VehicleIdentifiers {
  vin: string;
  vrm: string;
  vType: string;
}

export interface VehicleTechRecordEdit {
  msUserDetails: UserDetails;
  vin?: string;
  primaryVrm: string;
  secondaryVrms?: string[];
  trailerId?: string | undefined;
  techRecord: TechRecord[];
}

export interface VehicleTechRecordState {
  vehicleRecord: VehicleTechRecordModel;
  viewState: VIEW_STATE;
}
