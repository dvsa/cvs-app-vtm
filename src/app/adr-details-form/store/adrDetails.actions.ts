import { Action } from '@ngrx/store';
import { AddArrayControlAction, RemoveArrayControlAction } from 'ngrx-forms';
import { adrDetailsFormModel } from './adrDetailsForm.model';

export class LoadAction implements Action {
  static readonly TYPE = 'adrDetails/LOAD';
  readonly type = LoadAction.TYPE;
  constructor(public payload: any) { }
}

export class SetSubmittedValueAction implements Action {
  static readonly TYPE = 'adrDetails/SET_SUBMITTED_VALUE';
  readonly type = SetSubmittedValueAction.TYPE;
  constructor(public submittedValue: adrDetailsFormModel) { }
}

export class CreatePermittedDangerousGoodElementAction implements Action {
  static readonly TYPE = 'adrDetails/CREATE_PERMITTED_DANGEROUS_GOOD_ELEMENT';
  readonly type = CreatePermittedDangerousGoodElementAction.TYPE;
  constructor(public name: string, public payload: boolean = false) { }
}

export class RemovePermittedDangerousGoodElementAction implements Action {
  static readonly TYPE = 'adrDetails/REMOVE_PERMITTED_DANGEROUS_GOOD_ELEMENT';
  readonly type = RemovePermittedDangerousGoodElementAction.TYPE;
  constructor(public name: string) { }
}

export class CreateGuidanceNoteElementAction implements Action {
  static readonly TYPE = 'adrDetails/CREATE_GUIDANCE_NOTE_ELEMENT';
  readonly type = CreateGuidanceNoteElementAction.TYPE;
  constructor(public name: string, public payload: boolean = false) { }
}

export class RemoveGuidanceNoteElementAction implements Action {
  static readonly TYPE = 'adrDetails/REMOVE_GUIDANCE_NOTE_ELEMENT';
  readonly type = RemoveGuidanceNoteElementAction.TYPE;
  constructor(public name: string) { }
}

export class CreateProductListUnNoElementAction implements Action {
  static readonly TYPE = 'adrDetails/CREATE_PRODUCTLIST_UNNO_ELEMENT';
  readonly type = CreateProductListUnNoElementAction.TYPE;
  constructor(public name: string, public payload: string) { }
}

export class RemoveProductListUnNoElementAction implements Action {
  static readonly TYPE = 'adrDetails/REMOVE_PRODUCTLIST_UNNO_ELEMENT';
  readonly type = RemoveProductListUnNoElementAction.TYPE;
  constructor(public name: string) { }
}

export class CreateTc3TypeElementAction extends AddArrayControlAction<number>  {
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


export class DownloadDocumentFileAction implements Action {
  static readonly TYPE = 'technicalRecords/DOWNLOAD_DOCUMENT_FILE';
  readonly type = DownloadDocumentFileAction.TYPE;
  constructor(public filename: string) {
  }
}

export class DownloadDocumentFileActionSuccess implements Action {
  static readonly TYPE = 'technicalRecords/DOWNLOAD_DOCUMENT_FILE_SUCCESS';
  readonly type = DownloadDocumentFileActionSuccess.TYPE;
  constructor(public payload: { blob: Blob, fileName?: string }) {
  }
}

export class DownloadDocumentFileActionFailure implements Action {
  static readonly TYPE = 'technicalRecords/DOWNLOAD_DOCUMENT_FILE_FAILURE';
  readonly type = DownloadDocumentFileActionFailure.TYPE;
  constructor(public payload: any) {
  }
}

export class AddTankDocumentAction extends AddArrayControlAction<(string | ArrayBuffer)> {
  static readonly SUB_TYPE = 'adrDetails/ADD_TANK_DOCUMENT';
  readonly subtype = AddTankDocumentAction.SUB_TYPE;
  constructor(public controlId: string, public value: string | ArrayBuffer, index?: number) {
    super(controlId, value, index);
  }
}

export class RemoveTankDocumentAction extends RemoveArrayControlAction {
  static readonly SUB_TYPE = 'adrDetails/REMOVE_TANK_DOCUMENT';
  readonly subtype = RemoveTankDocumentAction.SUB_TYPE;
  constructor(public controlId: string, index?: number) {
    super(controlId, index);
  }
}

