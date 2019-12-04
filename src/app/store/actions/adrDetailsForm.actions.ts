import { Action } from "@ngrx/store";
import { VehicleTechRecordModel } from "@app/models/vehicle-tech-record.model";
import { adrDetailsFormModel } from "@app/models/adrDetailsForm.model";


export class SetSubmittedValueAction implements Action {
  static readonly TYPE = 'simpleForm/SET_SUBMITTED_VALUE';
  readonly type = SetSubmittedValueAction.TYPE;
  constructor(public submittedValue: adrDetailsFormModel) { }
}

export class CreatePermittedDangerousGoodElementAction implements Action {
  static readonly TYPE = 'adrDetails/CREATE_PERMITTED_DANGEROUS_GOOD_ELEMENT';
  readonly type = CreatePermittedDangerousGoodElementAction.TYPE;
  constructor(public name: string, public  payload: boolean) { }
}

export class RemovePermittedDangerousGoodElementAction implements Action {
  static readonly TYPE = 'adrDetails/REMOVE_PERMITTED_DANGEROUS_GOOD_ELEMENT';
  readonly type = RemovePermittedDangerousGoodElementAction.TYPE;
  constructor(public name: string) { }
}

export class CreateGuidanceNoteElementAction implements Action {
  static readonly TYPE = 'adrDetails/CREATE_GUIDANCE_NOTE_ELEMENT';
  readonly type = CreateGuidanceNoteElementAction.TYPE;
  constructor(public name: string, public  payload: boolean) { }
}

export class RemoveGuidanceNoteElementAction implements Action {
  static readonly TYPE = 'adrDetails/REMOVE_GUIDANCE_NOTE_ELEMENT';
  readonly type = RemoveGuidanceNoteElementAction.TYPE;
  constructor(public name: string) { }
}

// export class CreateProductListUnNoAction implements Action {
//   static readonly TYPE = 'adrDetails/CREATE_PRODUCT_LIST_UN_ELEMENT';
//   readonly type = CreateProductListUnNoAction.TYPE;
//   constructor(public name: string) { }
// }
