import {VehicleTechRecordModel} from '../../models/vehicle-tech-record.model';

export interface IVehicleTechRecordModelState {
  initialDetails: CreateTechRecordVM;
  vehicleTechRecordModel: VehicleTechRecordModel;
  selectedVehicleTechRecordModel: VehicleTechRecordModel;
  error?: any;
}

export interface CreateTechRecordVM {
  vin: string;
  vrm: string;
  vType: string;
}

export const initialVehicleTechRecordModelState: IVehicleTechRecordModelState = {
  initialDetails: null,
  vehicleTechRecordModel: null,
  selectedVehicleTechRecordModel: null,
  error: null
};


