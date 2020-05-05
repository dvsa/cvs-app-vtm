import { VrmModel } from '@app/models/vrm.model';
import { TechRecord } from '@app/models/tech-record.model';
import { MetaData } from './meta-data';

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
