import {Action} from '@ngrx/store';
import {adrDetailsFormModel} from '@app/models/adrDetailsForm.model';
import {AddArrayControlAction, RemoveArrayControlAction} from 'ngrx-forms';
import {VehicleTechRecordModel} from "@app/models/vehicle-tech-record.model";
import {EVehicleTechRecordModelActions} from "@app/store/actions/VehicleTechRecordModel.actions";


export class SetSubmittedValueAction implements Action {
  static readonly TYPE = 'simpleForm/SET_SUBMITTED_VALUE';
  readonly type = SetSubmittedValueAction.TYPE;

  constructor(public submittedValue: adrDetailsFormModel) {
  }
}

export class CreatePermittedDangerousGoodElementAction implements Action {
  static readonly TYPE = 'adrDetails/CREATE_PERMITTED_DANGEROUS_GOOD_ELEMENT';
  readonly type = CreatePermittedDangerousGoodElementAction.TYPE;

  constructor(public name: string, public  payload: boolean) {
  }
}

export class RemovePermittedDangerousGoodElementAction implements Action {
  static readonly TYPE = 'adrDetails/REMOVE_PERMITTED_DANGEROUS_GOOD_ELEMENT';
  readonly type = RemovePermittedDangerousGoodElementAction.TYPE;

  constructor(public name: string) {
  }
}

export class CreateGuidanceNoteElementAction implements Action {
  static readonly TYPE = 'adrDetails/CREATE_GUIDANCE_NOTE_ELEMENT';
  readonly type = CreateGuidanceNoteElementAction.TYPE;

  constructor(public name: string, public  payload: boolean) {
  }
}

export class RemoveGuidanceNoteElementAction implements Action {
  static readonly TYPE = 'adrDetails/REMOVE_GUIDANCE_NOTE_ELEMENT';
  readonly type = RemoveGuidanceNoteElementAction.TYPE;

  constructor(public name: string) {
  }
}

export class CreateProductListUnNoElementAction implements Action {
  static readonly TYPE = 'adrDetails/CREATE_PRODUCTLIST_UNNO_ELEMENT';
  readonly type = CreateProductListUnNoElementAction.TYPE;

  constructor(public name: string, public  payload: string) {
  }
}

export class RemoveProductListUnNoElementAction implements Action {
  static readonly TYPE = 'adrDetails/REMOVE_PRODUCTLIST_UNNO_ELEMENT';
  readonly type = RemoveProductListUnNoElementAction.TYPE;

  constructor(public name: string) {
  }
}

export class UpdateTechRecordFormState implements Action {
  static readonly TYPE = 'adrDetails/UpdateTechRecordFormState';
  public readonly type = UpdateTechRecordFormState.TYPE;

  constructor(public  payload: adrDetailsFormModel) {
  }
}

export class CreateTc3TypeElementAction extends AddArrayControlAction<number> {
  static readonly SUB_TYPE = 'adrDetails/CREATE_TC3_TYPE_ELEMENT';
  public readonly subtype = CreateTc3TypeElementAction.SUB_TYPE;

  constructor(public controlId: string, public value: any, index?: number) {
    super(controlId, value, index);
  }
}

export class CreateTc3PeriodicNumberElementAction extends AddArrayControlAction<number> {
  static readonly SUB_TYPE = 'adrDetails/CREATE_TC3_PERIODIC_NUMBER_ELEMENT';
  readonly subtype = CreateTc3PeriodicNumberElementAction.SUB_TYPE;

  constructor(public controlId: string, public value: any, index?: number) {
    super(controlId, value, index);
  }
}

export class CreateTc3PeriodicExpiryDateElementAction extends AddArrayControlAction<{ day: number; month: number; year: number; }> {
  static readonly SUB_TYPE = 'adrDetails/CREATE_TC3_PERIODIC_EXPIRY_DATE_ELEMENT';
  readonly subtype = CreateTc3PeriodicExpiryDateElementAction.SUB_TYPE;

  constructor(public controlId: string, public value: any, index?: number) {
    super(controlId, value, index);
  }
}


