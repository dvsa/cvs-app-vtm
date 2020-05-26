import { Action } from '@ngrx/store';
import { ModalState } from './modal.reducer';

export enum EModalStateActions {
  LoadModal = '[Load] Modal',
  ResetModal = '[Reset] Modal',
  RedirectModal = '[Redirect] Modal'
}

export class LoadModal implements Action {
  public readonly type = EModalStateActions.LoadModal;
  constructor(public payload: ModalState) {}
}

export class ResetModal implements Action {
  public readonly type = EModalStateActions.ResetModal;
  constructor(public urlToRedirect?: string) {}
}

export class RedirectModal implements Action {
  public readonly type = EModalStateActions.RedirectModal;
  constructor(public urlToRedirect?: string) {}
}

export type ModalStateActions = LoadModal | ResetModal;
