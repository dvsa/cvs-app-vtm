import { Action } from '@ngrx/store';
import { VehicleTechRecordModel } from '../../models/vehicle-tech-record.model';
import { CreateTechRecordVM } from '@app/store/state/VehicleTechRecordModel.state';
import { TechRecord } from './../../models/tech-record.model';
import { SearchParams } from '@app/models/search-params';

export enum EVehicleTechRecordModelActions {
  GetVehicleTechRecordModel = '[VehicleTechRecordModel] Get VehicleTechRecordModel',
  GetVehicleTechRecordModelSuccess = '[VehicleTechRecordModel] Get VehicleTechRecordModel Success',
  GetVehicleTechRecordModelHavingStatusAll = '[VehicleTechRecordModel] Get VehicleTechRecordModelHavingStatusAll',
  GetVehicleTechRecordModelHavingStatusAllSuccess = '[VehicleTechRecordModel] Get VehicleTechRecordModelHavingStatusAll Success',
  GetVehicleTechRecordModelHavingStatusAllFailure = '[VehicleTechRecordModel] Get VehicleTechRecordModelHavingStatusAll Failure',

  SetVehicleTechRecordModelVinOnCreate = '[VehicleTechRecordModel] SetVehicleTechRecordModelVinOnCreate',
  SetVehicleTechRecordModelVinOnCreateSucess = '[VehicleTechRecordModel] SetVehicleTechRecordModelVinOnCreateSucess',
  SetVehicleTechRecordIdentifier = '[VehicleTechRecordModel Effect] Set VehicleTechRecordModel',
  UpdateVehicleTechRecord = '[TechRecordContainer] Update VehicleTechRecordModel',
  UpdateVehicleTechRecordSuccess = '[TechRecordContainer] Update VehicleTechRecordModel Success',
  SetSelectedVehicleTechnicalRecord = '[MultipleTechRecordContainer] Set Selected Vehicle Technical Record',
  SetSelectedVehicleTechnicalRecordSucess = '[VehicleTechnicalRecordEffect] Set SelectedVehicleTechnicalRecordSucess'
}

export class GetVehicleTechRecordModel implements Action {
  public readonly type = EVehicleTechRecordModelActions.GetVehicleTechRecordModel;
  constructor(public payload: TechRecord) {}
}

export class GetVehicleTechRecordModelSuccess implements Action {
  public readonly type = EVehicleTechRecordModelActions.GetVehicleTechRecordModelSuccess;
  constructor(public payload: VehicleTechRecordModel[]) {}
}

export class GetVehicleTechRecordModelHavingStatusAll implements Action {
  public readonly type = EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAll;

  constructor(public payload: SearchParams) {}
}

export class GetVehicleTechRecordModelHavingStatusAllSuccess implements Action {
  public readonly type =
    EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAllSuccess;

  constructor(public payload: VehicleTechRecordModel[]) {}
}

export class GetVehicleTechRecordModelHavingStatusAllFailure implements Action {
  public readonly type =
    EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAllFailure;

  constructor(public payload: any) {}
}

export class SetVehicleTechRecordModelVinOnCreate implements Action {
  public readonly type = EVehicleTechRecordModelActions.SetVehicleTechRecordModelVinOnCreate;
  constructor(public payload: CreateTechRecordVM) {}
}

export class SetVehicleTechRecordModelVinOnCreateSucess implements Action {
  public readonly type =
    EVehicleTechRecordModelActions.SetVehicleTechRecordModelVinOnCreateSucess;
  constructor(public payload: CreateTechRecordVM) {}
}

export class SetVehicleTechRecordIdentifier implements Action {
  readonly type = EVehicleTechRecordModelActions.SetVehicleTechRecordIdentifier;
  constructor(public techRecordIdentifier: string) {}
}

export class UpdateVehicleTechRecord implements Action {
  readonly type = EVehicleTechRecordModelActions.UpdateVehicleTechRecord;
  constructor(public readonly techRecord: TechRecord) {}
}

export class UpdateVehicleTechRecordSuccess implements Action {
  readonly type = EVehicleTechRecordModelActions.UpdateVehicleTechRecordSuccess;
  constructor(public readonly vehicleTechRecord: VehicleTechRecordModel) {}
}

export class SetSelectedVehicleTechnicalRecord implements Action {
  readonly type = EVehicleTechRecordModelActions.SetSelectedVehicleTechnicalRecord;
  constructor(public vehicleTechRecord: VehicleTechRecordModel) {}
}
export class SetSelectedVehicleTechnicalRecordSucess implements Action {
  readonly type = EVehicleTechRecordModelActions.SetSelectedVehicleTechnicalRecordSucess;
  constructor(public vehicleTechRecord: VehicleTechRecordModel) {}
}

export type VehicleTechRecordModelActions =
  | GetVehicleTechRecordModel
  | GetVehicleTechRecordModelSuccess
  | GetVehicleTechRecordModelHavingStatusAll
  | GetVehicleTechRecordModelHavingStatusAllSuccess
  | GetVehicleTechRecordModelHavingStatusAllFailure
  | SetVehicleTechRecordModelVinOnCreate
  | SetVehicleTechRecordModelVinOnCreateSucess
  | SetVehicleTechRecordIdentifier
  | UpdateVehicleTechRecord
  | UpdateVehicleTechRecordSuccess
  | SetSelectedVehicleTechnicalRecord
  | SetSelectedVehicleTechnicalRecordSucess;
