import {VehicleTechRecordModel} from '../../models/vehicle-tech-record.model';

export interface IVehicleTechRecordModelState {
  initialDetails: CreateTechRecordVM;
  vehicleTechRecordModel: VehicleTechRecordModel[];
  selectedTechRecordIdentifier: string;
  selectedVehicleTechRecordModel: VehicleTechRecordModel[];
  selectedVehicleTechRecord: VehicleTechRecordModel;
  error?: any;
}

export interface CreateTechRecordVM {
  vin: string;
  vrm: string;
  vType: string;
  error: string[];
}

export const initialVehicleTechRecordModelState: IVehicleTechRecordModelState = {
  initialDetails: {
    vin: '',
    vrm: '',
    vType: '',
    error: []
  },
  vehicleTechRecordModel: null,
  selectedTechRecordIdentifier: null,
  selectedVehicleTechRecordModel: null,
  selectedVehicleTechRecord: null,
  error: null
};


