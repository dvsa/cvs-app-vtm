import { Action } from '@ngrx/store';
import {
  VehicleIdentifiers,
  VehicleTechRecordModel,
  VehicleTechRecordEdit,
  VehicleTechRecordState
} from '@app/models/vehicle-tech-record.model';
import { SearchParams } from '@app/models/search-params';
import { VIEW_STATE } from '@app/app.enums';

export enum EVehicleTechRecordActions {
  GetVehicleTechRecordHavingStatusAll = '[VehicleTechnicalRecordEffect] Get VehicleTechRecordHavingStatusAll',
  GetVehicleTechRecordHavingStatusAllSuccess = '[VehicleTechnicalRecordEffect] Get VehicleTechRecordHavingStatusAll Success',

  CreateVehicleTechRecord = '[TechRecordContainer] Create VehicleTechRecord',

  UpdateVehicleTechRecord = '[TechRecordContainer] Update VehicleTechRecord',
  UpdateVehicleTechRecordSuccess = '[VehicleTechnicalRecordEffect] Update VehicleTechRecord Success',

  SetVehicleTechRecordOnCreate = '[TechnicalRecordCreateComponent] Set Vehicle Technical Record On Create',
  SetSelectedVehicleTechnicalRecord = '[MultipleTechRecordContainer] Set Selected Vehicle Technical Record',
  SetSelectedVehicleTechRecordSuccess = '[VehicleTechnicalRecordEffect] Set Selected Vehicle Technical Record Sucess',
  SetViewState = '[VehicleTechnicalRecordEffect] Set ViewState'
}

export class GetVehicleTechRecordHavingStatusAll implements Action {
  public readonly type = EVehicleTechRecordActions.GetVehicleTechRecordHavingStatusAll;

  constructor(public payload: SearchParams) {}
}

export class GetVehicleTechRecordHavingStatusAllSuccess implements Action {
  public readonly type = EVehicleTechRecordActions.GetVehicleTechRecordHavingStatusAllSuccess;

  constructor(public vehicleTechRecords: VehicleTechRecordModel[]) {}
}

export class SetVehicleTechRecordOnCreate implements Action {
  public readonly type = EVehicleTechRecordActions.SetVehicleTechRecordOnCreate;
  constructor(public payload: VehicleIdentifiers) {}
}

export class CreateVehicleTechRecord implements Action {
  public readonly type = EVehicleTechRecordActions.CreateVehicleTechRecord;
  constructor(public vehicleRecordEdit: VehicleTechRecordEdit) {}
}

export class UpdateVehicleTechRecord implements Action {
  public readonly type = EVehicleTechRecordActions.UpdateVehicleTechRecord;
  constructor(public vehicleRecordEdit: VehicleTechRecordEdit) {}
}

export class UpdateVehicleTechRecordSuccess implements Action {
  readonly type = EVehicleTechRecordActions.UpdateVehicleTechRecordSuccess;
  constructor(public vehicleTechRecord: VehicleTechRecordModel) {}
}

export class SetSelectedVehicleTechnicalRecord implements Action {
  readonly type = EVehicleTechRecordActions.SetSelectedVehicleTechnicalRecord;
  constructor(public vehicleRecordState: VehicleTechRecordState) {}
}

export class SetSelectedVehicleTechRecordSuccess implements Action {
  readonly type = EVehicleTechRecordActions.SetSelectedVehicleTechRecordSuccess;
  constructor(public vehicleTechRecord: VehicleTechRecordModel) {}
}

export class SetViewState implements Action {
  readonly type = EVehicleTechRecordActions.SetViewState;
  constructor(public viewState: VIEW_STATE) {}
}

export type VehicleTechRecordActions =
  | GetVehicleTechRecordHavingStatusAll
  | GetVehicleTechRecordHavingStatusAllSuccess
  | SetVehicleTechRecordOnCreate
  | CreateVehicleTechRecord
  | UpdateVehicleTechRecord
  | UpdateVehicleTechRecordSuccess
  | SetSelectedVehicleTechnicalRecord
  | SetSelectedVehicleTechRecordSuccess
  | SetViewState;
