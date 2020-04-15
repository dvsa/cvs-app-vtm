import { Action } from '@ngrx/store';

export enum EAppFormStateActions {
  SetAppFormDirty = 'SetAppFormDirty',
  SetAppFormPristine = 'SetAppFormPristine'
}

export class SetAppFormDirty implements Action {
  public readonly type = EAppFormStateActions.SetAppFormDirty;
}

export class SetAppFormPristine implements Action {
  public readonly type = EAppFormStateActions.SetAppFormPristine;
}

export type AppFormStateActions = SetAppFormDirty | SetAppFormPristine;
