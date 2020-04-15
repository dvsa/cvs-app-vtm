import { Action } from '@ngrx/store';
import { ModalState } from './modal.reducer';

export enum EModalStateActions {
  LoadModal = '[Load] Modal',
  ResetModal = '[Reset] Modal',
  ChangeView = '[ChangeView] Modal'
}

export class LoadModal implements Action {
  public readonly type = EModalStateActions.LoadModal;
  constructor(public payload: ModalState) {}
}

export class ResetModal implements Action {
  public readonly type = EModalStateActions.ResetModal;
  constructor(public payload?: string) {}
}

export class ChangeView implements Action {
  public readonly type = EModalStateActions.ChangeView;
  constructor(public urlToRedirect: string) {}
}

export type ModalStateActions = LoadModal  | ResetModal | ChangeView;
