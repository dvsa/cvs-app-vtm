import { Action } from '@ngrx/store';
import { Preparer } from '@app/models/preparer';
import { TestStation } from '@app/models/test-station';
import { TestTypeCategory } from '@app/models/test-type-category';

export enum EReferenceDataActions {
  LoadPreparers = 'LoadPreparers',
  LoadPreparersSuccess = '[Preparers Guard] LoadPreparersSuccess',
  LoadTestStations = 'LoadTestStations',
  LoadTestStationsSuccess = '[TestStation Guard] LoadTestStationsSuccess',
  LoadTestTypeCategoriesSuccess = '[TestTypeCategories Guard LoadTestTypeCategoriesSuccess]'
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

export class LoadTestTypeCategoriesSuccess implements Action {
  readonly type = EReferenceDataActions.LoadTestTypeCategoriesSuccess;
  constructor(public testTypeCategories: TestTypeCategory[]) {}
}

export type ReferenceDataActions =
  | LoadPreparers
  | LoadTestStations
  | LoadPreparersSuccess
  | LoadTestStationsSuccess
  | LoadTestTypeCategoriesSuccess;
