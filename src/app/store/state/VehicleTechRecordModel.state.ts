import {VehicleTechRecordModel} from '../../models/vehicle-tech-record.model';
import {VIEW_STATE} from '@app/app.enums';

export interface IVehicleTechRecordModelState {
  initialDetails: CreateTechRecordVM;
  vehicleTechRecordModel: VehicleTechRecordModel[];
  selectedTechRecordIdentifier: string;
  selectedVehicleTechRecordModel: VehicleTechRecordModel[];
  selectedVehicleTechRecord: VehicleTechRecordModel;
  viewState: VIEW_STATE;
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
  viewState: VIEW_STATE.VIEW_ONLY,
  error: null
};


