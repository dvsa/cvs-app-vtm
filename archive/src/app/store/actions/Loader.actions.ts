import { Action } from '@ngrx/store';

export enum ELoadingActions {
  AppIsLoading = '[Loading] True',
  AppIsNotLoading = '[Loading] False'
}

export class LoadingTrue implements Action {
  public readonly type = ELoadingActions.AppIsLoading;
}

export class LoadingFalse implements Action {
  public readonly type = ELoadingActions.AppIsNotLoading;
}

export type LoadingActions = LoadingTrue | LoadingFalse;
