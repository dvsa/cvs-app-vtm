import { Action } from '@ngrx/store';
import { adrDetailsFormModel } from '@app/models/adrDetailsForm.model';
import {AddArrayControlAction, RemoveArrayControlAction} from 'ngrx-forms';


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

export class CreateProductListUnNoElementAction implements Action {
  static readonly TYPE = 'adrDetails/CREATE_PRODUCTLIST_UNNO_ELEMENT';
  readonly type = CreateProductListUnNoElementAction.TYPE;
  constructor(public name: string, public  payload: string) { }
}

export class RemoveProductListUnNoElementAction implements Action {
  static readonly TYPE = 'adrDetails/REMOVE_PRODUCTLIST_UNNO_ELEMENT';
  readonly type = RemoveProductListUnNoElementAction.TYPE;
  constructor(public name: string) { }
}

export class CreateTc3TypeElementAction  {
  static readonly TYPE = 'adrDetails/CREATE_TC3_TYPE_ELEMENT';
  readonly type = CreateTc3TypeElementAction.TYPE;
  private readonly arraycontrolAction: AddArrayControlAction<number>;
  constructor(public controlId: string, public value: any, index?: number) {
    this.arraycontrolAction = new AddArrayControlAction<number>(controlId, value, index);
  }

  get index(): number | undefined {
    return this.arraycontrolAction.index;
  }
}

export class CreateTc3PeriodicNumberElementAction  {
  static readonly TYPE = 'adrDetails/CREATE_TC3_PERIODIC_NUMBER_ELEMENT';
  readonly type = CreateTc3PeriodicNumberElementAction.TYPE;
  private readonly arraycontrolAction: AddArrayControlAction<number>;
  constructor(public controlId: string, public value: any, index?: number) {
    this.arraycontrolAction = new AddArrayControlAction<number>(controlId, value, index);
  }

  get index(): number | undefined {
    return this.arraycontrolAction.index;
  }
}

export class CreateTc3PeriodicExpiryDateElementAction  {
  static readonly TYPE = 'adrDetails/CREATE_TC3_PERIODIC_EXPIRY_DATE_ELEMENT';
  readonly type = CreateTc3PeriodicExpiryDateElementAction.TYPE;
  private readonly arraycontrolAction: AddArrayControlAction<number>;
  constructor(public controlId: string, public value: any, index?: number) {
    this.arraycontrolAction = new AddArrayControlAction<number>(controlId, value, index);
  }

  get index(): number | undefined {
    return this.arraycontrolAction.index;
  }
}

// export class RemoveTc3TypeElementAction extends RemoveArrayControlAction {
//   // static readonly TYPE = 'adrDetails/REMOVE_TC3_TYPE_ELEMENT';
//   // readonly type = RemoveTc3TypeElementAction.TYPE;
//   constructor(public controlId: string, index: number) {
//     super(controlId, index);
//   }
// }
