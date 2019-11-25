import { Action } from "@ngrx/store";
import { VehicleTechRecordModel } from "@app/models/vehicle-tech-record.model";
import { adrDetailsFormModel } from "@app/models/adrDetailsForm.model";


export class SetSubmittedValueAction implements Action {
  static readonly TYPE = 'simpleForm/SET_SUBMITTED_VALUE';
  readonly type = SetSubmittedValueAction.TYPE;
  constructor(public submittedValue: adrDetailsFormModel) { }
}

export class CreateGroupElementAction implements Action {
  static readonly TYPE = 'adrDetails/CREATE_GROUP_ELEMENT';
  readonly type = CreateGroupElementAction.TYPE;
  constructor(public name: string, public  payload: VehicleTechRecordModel) { }
}

export class RemoveGroupElementAction implements Action {
  static readonly TYPE = 'adrDetails/REMOVE_GROUP_ELEMENT';
  readonly type = RemoveGroupElementAction.TYPE;
  constructor(public name: string) { }
}