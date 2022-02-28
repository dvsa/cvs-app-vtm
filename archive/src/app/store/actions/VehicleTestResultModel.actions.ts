import { Action } from '@ngrx/store';
import { TestResultModel } from '../../models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';
import { TestResultTestTypeNumber } from '@app/models/test-result-test-type-number';
import { KeyValue } from '@angular/common';

export enum EVehicleTestResultModelActions {
  GetVehicleTestResultModel = '[TestResultModel] Get TestResultModel',
  GetVehicleTestResultModelSuccess = '[TestResultModel] Get TestResultModel Success',
  GetVehicleTestResultModelFailure = '[TestResultModel] Get TestResultModel Failure',
  SetTestViewState = '[TestResultComponent] SetTestViewState',
  UpdateTestResult = '[UpdateTestResult] Update Test Result',
  UpdateTestResultSuccess = '[UpdateTestResultSuccess]',
  SetSelectedTestResultModel = '[SetSelectedVehicleTestResultModel]',
  SetSelectedTestResultModelSuccess = '[SetSelectedVehicleTestResultModelSuccess]',
  UpdateSelectedTestResultModel = '[UpdateSelectedTestResultModel]',
  UpdateSelectedTestResultModelSuccess = '[UpdateSelectedTestResultModelSuccess]',
  DownloadCertificate = '[DownloadCertificate]'
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

export class SetTestViewState implements Action {
  readonly type = EVehicleTestResultModelActions.SetTestViewState;
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

export class SetSelectedTestResultModel implements Action {
  public readonly type = EVehicleTestResultModelActions.SetSelectedTestResultModel;
  constructor(public payload: string) {}
}

export class SetSelectedTestResultModelSuccess implements Action {
  public readonly type = EVehicleTestResultModelActions.SetSelectedTestResultModelSuccess;
  constructor(public payload: TestResultModel) {}
}

export class DownloadCertificate implements Action {
  public readonly type = EVehicleTestResultModelActions.DownloadCertificate;
  constructor(public payload: string) {}
}

export class UpdateSelectedTestResultModel implements Action {
  readonly type = EVehicleTestResultModelActions.UpdateSelectedTestResultModel;
  constructor(public payload: KeyValue<string, string>) {}
}

export class UpdateSelectedTestResultModelSuccess implements Action {
  readonly type = EVehicleTestResultModelActions.UpdateSelectedTestResultModelSuccess;
  constructor(public payload: TestResultModel) {}
}

export type VehicleTestResultModelActions =
  | GetVehicleTestResultModel
  | GetVehicleTestResultModelSuccess
  | GetVehicleTestResultModelFailure
  | SetTestViewState
  | UpdateTestResult
  | UpdateTestResultSuccess
  | SetSelectedTestResultModel
  | SetSelectedTestResultModelSuccess
  | UpdateSelectedTestResultModel
  | UpdateSelectedTestResultModelSuccess
  | DownloadCertificate;
