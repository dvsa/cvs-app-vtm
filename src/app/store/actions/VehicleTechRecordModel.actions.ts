import { Action } from '@ngrx/store';
import {VehicleIdentifiers, VehicleTechRecordModel} from '@app/models/vehicle-tech-record.model';
import { TechRecord } from '@app/models/tech-record.model';
import { SearchParams } from '@app/models/search-params';
import { VIEW_STATE } from '@app/app.enums';

export enum EVehicleTechRecordModelActions {
  GetVehicleTechRecordModel = '[VehicleTechRecordModel] Get VehicleTechRecordModel',
  GetVehicleTechRecordModelSuccess = '[VehicleTechRecordModel] Get VehicleTechRecordModel Success',
  GetVehicleTechRecordModelHavingStatusAll = '[VehicleTechRecordModel] Get VehicleTechRecordModelHavingStatusAll',
  GetVehicleTechRecordModelHavingStatusAllSuccess = '[VehicleTechRecordModel] Get VehicleTechRecordModelHavingStatusAll Success',

  SetVehicleTechRecordModelOnCreate = '[VehicleTechRecordModel] SetVehicleTechRecordModelVinOnCreate',
  UpdateVehicleTechRecord = '[TechRecordContainer] Update VehicleTechRecordModel',
  UpdateVehicleTechRecordSuccess = '[TechRecordContainer] Update VehicleTechRecordModel Success',
  SetSelectedVehicleTechnicalRecord = '[MultipleTechRecordContainer] Set Selected Vehicle Technical Record',
  SetSelectedVehicleTechnicalRecordSucess = '[VehicleTechnicalRecordEffect] Set SelectedVehicleTechnicalRecordSucess',
  SetViewState = '[TechnicalRecordComponent] Set ViewState Variable'
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

export class SetVehicleTechRecordModelOnCreate implements Action {
  public readonly type = EVehicleTechRecordModelActions.SetVehicleTechRecordModelOnCreate;
  constructor(public payload: VehicleIdentifiers) {}
}

export class UpdateVehicleTechRecord implements Action {
  readonly type = EVehicleTechRecordModelActions.UpdateVehicleTechRecord;
  constructor(public readonly techRecord: TechRecord) {}
}

export class UpdateVehicleTechRecordSuccess implements Action {
  readonly type = EVehicleTechRecordModelActions.UpdateVehicleTechRecordSuccess;
  constructor(public vehicleTechRecord: VehicleTechRecordModel) {}
}

export class SetSelectedVehicleTechnicalRecord implements Action {
  readonly type = EVehicleTechRecordModelActions.SetSelectedVehicleTechnicalRecord;
  constructor(public vehicleTechRecord: VehicleTechRecordModel) {}
}
export class SetSelectedVehicleTechnicalRecordSucess implements Action {
  readonly type = EVehicleTechRecordModelActions.SetSelectedVehicleTechnicalRecordSucess;
  constructor(public vehicleTechRecord: VehicleTechRecordModel) {}
}

export class SetViewState implements Action {
  readonly type = EVehicleTechRecordModelActions.SetViewState;
  constructor(public viewState: VIEW_STATE) {}
}

export type VehicleTechRecordModelActions =
  | GetVehicleTechRecordModel
  | GetVehicleTechRecordModelSuccess
  | GetVehicleTechRecordModelHavingStatusAll
  | GetVehicleTechRecordModelHavingStatusAllSuccess
  | SetVehicleTechRecordModelOnCreate
  | UpdateVehicleTechRecord
  | UpdateVehicleTechRecordSuccess
  | SetSelectedVehicleTechnicalRecord
  | SetSelectedVehicleTechnicalRecordSucess
  | SetViewState;
