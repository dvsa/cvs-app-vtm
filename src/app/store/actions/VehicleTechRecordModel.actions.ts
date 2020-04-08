import { Action } from '@ngrx/store';
import { VehicleTechRecordModel } from '../../models/vehicle-tech-record.model';
import { CreateTechRecordVM } from '@app/store/state/VehicleTechRecordModel.state';
import { TechRecord } from './../../models/tech-record.model';
import { SearchParams } from '@app/models/search-params';
import { VIEW_STATE } from '@app/app.enums';

export enum EVehicleTechRecordModelActions {
  GetVehicleTechRecordModel = '[VehicleTechRecordModel] Get VehicleTechRecordModel',

  GetVehicleTechRecordModelHavingStatusAll = '[VehicleTechRecordModel] Get VehicleTechRecordModelHavingStatusAll',
  GetVehicleTechRecordModelHavingStatusAllSuccess = '[VehicleTechRecordModel] Get VehicleTechRecordModelHavingStatusAll Success',

  SetVehicleTechRecordModelVinOnCreate = '[VehicleTechRecordModel] SetVehicleTechRecordModelVinOnCreate',
  SetVehicleTechRecordModelVinOnCreateSucess = '[VehicleTechRecordModel] SetVehicleTechRecordModelVinOnCreateSucess',
  UpdateVehicleTechRecord = '[TechRecordContainer] Update VehicleTechRecordModel',
  UpdateVehicleTechRecordSuccess = '[TechRecordContainer] Update VehicleTechRecordModel Success',
  SetSelectedVehicleTechnicalRecord = '[MultipleTechRecordContainer] Set Selected Vehicle Technical Record',
  SetSelectedVehicleTechnicalRecordSucess = '[VehicleTechnicalRecordEffect] Set SelectedVehicleTechnicalRecordSucess',
  SetViewState = '[TechnicalRecordContainer] Set ViewState Variable'
}

export class GetVehicleTechRecordModel implements Action {
  public readonly type = EVehicleTechRecordModelActions.GetVehicleTechRecordModel;
  constructor(public payload: TechRecord) {}
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

export class SetVehicleTechRecordModelVinOnCreate implements Action {
  public readonly type = EVehicleTechRecordModelActions.SetVehicleTechRecordModelVinOnCreate;
  constructor(public payload: CreateTechRecordVM) {}
}

export class SetVehicleTechRecordModelVinOnCreateSucess implements Action {
  public readonly type =
    EVehicleTechRecordModelActions.SetVehicleTechRecordModelVinOnCreateSucess;
  constructor(public payload: CreateTechRecordVM) {}
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
  | GetVehicleTechRecordModelHavingStatusAll
  | GetVehicleTechRecordModelHavingStatusAllSuccess
  | SetVehicleTechRecordModelVinOnCreate
  | SetVehicleTechRecordModelVinOnCreateSucess
  | UpdateVehicleTechRecord
  | UpdateVehicleTechRecordSuccess
  | SetSelectedVehicleTechnicalRecord
  | SetSelectedVehicleTechnicalRecordSucess
  | SetViewState;
