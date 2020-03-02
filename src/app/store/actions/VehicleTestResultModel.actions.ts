import { Action } from '@ngrx/store';
import { TestResultModel } from '../../models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';
import { TestResultTestTypeNumber } from '@app/models/test-result-test-type-number';

export enum EVehicleTestResultModelActions {
  GetVehicleTestResultModel = '[TestResultModel] Get TestResultModel',
  GetVehicleTestResultModelSuccess = '[TestResultModel] Get TestResultModel Success',
  GetVehicleTestResultModelFailure = '[TestResultModel] Get TestResultModel Failure',
  SetCurrentState = '[TestResultComponent] SetCurrentState',
  UpdateTestResult = '[UpdateTestResult] Update Test Result',
  UpdateTestResultSuccess = '[UpdateTestResultSuccess]'
}

export class GetVehicleTestResultModel implements Action {
  public readonly type = EVehicleTestResultModelActions.GetVehicleTestResultModel;
  constructor(public payload: string) {}
}

export class GetVehicleTestResultModelSuccess implements Action {
  public readonly type = EVehicleTestResultModelActions.GetVehicleTestResultModelSuccess;
  constructor(public payload: TestResultModel[]) {}
}

export class GetVehicleTestResultModelFailure implements Action {
  public readonly type = EVehicleTestResultModelActions.GetVehicleTestResultModelFailure;
  constructor(public payload: string) {}
}

export class SetCurrentState implements Action {
  readonly type = EVehicleTestResultModelActions.SetCurrentState;
  constructor(public editState: VIEW_STATE) {}
}

export class UpdateTestResult implements Action {
  readonly type = EVehicleTestResultModelActions.UpdateTestResult;
  constructor(public testResultTestTypeNumber: TestResultTestTypeNumber) {}
}

export class UpdateTestResultSuccess implements Action {
  readonly type = EVehicleTestResultModelActions.UpdateTestResultSuccess;
  constructor(public testResultTestTypeNumber: TestResultTestTypeNumber) {}
}

export type VehicleTestResultModelActions =
  | GetVehicleTestResultModel
  | GetVehicleTestResultModelSuccess
  | GetVehicleTestResultModelFailure
  | SetCurrentState
  | UpdateTestResult
  | UpdateTestResultSuccess;
