import { Action } from '@ngrx/store';
import { Preparer } from '@app/models/preparer';
import { TestStation } from '@app/models/test-station';

export enum EReferenceDataActions {
  LoadPreparers = 'LoadPreparers',
  LoadPreparersSuccess = '[Preparers Guard] LoadPreparersSuccess',
  LoadTestStations = 'LoadTestStations',
  LoadTestStationsSuccess = '[TestStation Guard] LoadTestStationsSuccess'
}

export class LoadPreparers implements Action {
  public readonly type = EReferenceDataActions.LoadPreparers;
}

export class LoadTestStations implements Action {
  readonly type = EReferenceDataActions.LoadTestStations;
}

export class LoadPreparersSuccess implements Action {
  public readonly type = EReferenceDataActions.LoadPreparersSuccess;
  constructor(public preparers: Preparer[]) {}
}

export class LoadTestStationsSuccess implements Action {
  readonly type = EReferenceDataActions.LoadTestStationsSuccess;
  constructor(public testStations: TestStation[]) {}
}

export type ReferenceDataActions =
  | LoadPreparers
  | LoadTestStations
  | LoadPreparersSuccess
  | LoadTestStationsSuccess;
