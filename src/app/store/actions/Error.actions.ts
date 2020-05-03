import { Action } from '@ngrx/store';

export enum EErrorActions {
  SetErrorMessage = '[Error] Set',
  ClearErrorMessage = '[Error] Clear'
}

export class SetErrorMessage implements Action {
  public readonly type = EErrorActions.SetErrorMessage;
  constructor(public payload: string[]) {}
}

export class ClearErrorMessage implements Action {
  public readonly type = EErrorActions.ClearErrorMessage;
}

export type ErrorActions = SetErrorMessage | ClearErrorMessage;
