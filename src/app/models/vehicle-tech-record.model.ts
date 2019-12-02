import {VrmModel} from '@app/models/vrm.model';
import {TechRecordModel} from '@app/models/tech-record.model';
import { MetaData } from './MetaData';

export interface VehicleTechRecordModel {
  vrms: VrmModel[];
  vin: string;
  techRecord: TechRecordModel[];
  metadata: MetaData;
  error?: any | null | undefined;
}
