import {VrmModel} from '@app/models/vrm.model';
import {TechRecordModel} from '@app/models/tech-record.model';

export interface VehicleTechRecordModel {
  vrms: VrmModel[];
  vin: string;
  techRecord: TechRecordModel[];
}
