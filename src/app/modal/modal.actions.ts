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

export class ChangeView implements Action {
  public readonly type = EModalStateActions.ChangeView;
  constructor(public payload: ModalState) {}
}

export type ModalStateActions = LoadModal | ChangeView;
