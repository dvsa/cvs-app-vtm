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

// export interface VehicleTechRecordEdit {
//   msUserDetails: UserDetails;
//   vin?: string;
//   primaryVrm: string;
//   secondaryVrms?: string[];
//   trailerId?: string | undefined;
//   techRecord: TechRecord[];
// }

export interface VehicleTechRecordState {
  vehicleRecord: VehicleTechRecordModel;
  // viewState: VIEW_STATE;
}

// export interface VehicleTechRecordEditState {
//   vehicleRecordEdit: VehicleTechRecordEdit;
//   // viewState: VIEW_STATE;
// }

// export interface UpdateRecordInfo {
//   vehicleRecord: VehicleTechRecordEdit;
//   systemNumber: string;
//   oldStatusCode?: string;
// }
