export interface VehicleTechRecordModel {
  vrms: VrmModel[];
  vin: string;
  trailerId?: string;
  systemNumber: string;
}

export interface VrmModel {
  vrm: string;
  isPrimary: boolean;
}
