import { Action } from '@ngrx/store';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';
import { TestResultTestTypeNumber } from '@app/models/test-result-test-type-number';
import { KeyValue } from '@angular/common';
import { VehicleTestResultUpdate } from '@app/models/vehicle-test-result-update';

export enum EVehicleTestResultActions {
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
  DownloadCertificate = '[DownloadCertificate]',
  CreateTestResult = '[CreateTestResult]',
  CreateTestResultSuccess = '[CreateTestResultSuccess]'
}

export class GetVehicleTestResultModel implements Action {
  public readonly type = EVehicleTestResultActions.GetVehicleTestResultModel;
  constructor(public payload: string) {}
}

export class GetVehicleTestResultModelSuccess implements Action {
  public readonly type = EVehicleTestResultActions.GetVehicleTestResultModelSuccess;
  constructor(public payload: TestResultModel[]) {}
}

export class GetVehicleTestResultModelFailure implements Action {
  public readonly type = EVehicleTestResultActions.GetVehicleTestResultModelFailure;
  constructor(public payload: string) {}
}

export class SetTestViewState implements Action {
  readonly type = EVehicleTestResultActions.SetTestViewState;
  constructor(public editState: VIEW_STATE) {}
}

export class UpdateTestResult implements Action {
  readonly type = EVehicleTestResultActions.UpdateTestResult;
  constructor(public testResultTestTypeNumber: TestResultTestTypeNumber) {}
}

export class UpdateTestResultSuccess implements Action {
  readonly type = EVehicleTestResultActions.UpdateTestResultSuccess;
  constructor(public testResultTestTypeNumber: TestResultTestTypeNumber) {}
}

export class SetSelectedTestResultModel implements Action {
  public readonly type = EVehicleTestResultActions.SetSelectedTestResultModel;
  constructor(public payload: string) {}
}

export class SetSelectedTestResultModelSuccess implements Action {
  public readonly type = EVehicleTestResultActions.SetSelectedTestResultModelSuccess;
  constructor(public payload: TestResultModel) {}
}

export class DownloadCertificate implements Action {
  public readonly type = EVehicleTestResultActions.DownloadCertificate;
  constructor(public payload: string) {}
}

export class UpdateSelectedTestResultModel implements Action {
  readonly type = EVehicleTestResultActions.UpdateSelectedTestResultModel;
  constructor(public payload: KeyValue<string, string>) {}
}

export class UpdateSelectedTestResultModelSuccess implements Action {
  readonly type = EVehicleTestResultActions.UpdateSelectedTestResultModelSuccess;
  constructor(public payload: TestResultModel) {}
}

export class CreateTestResult implements Action {
  readonly type = EVehicleTestResultActions.CreateTestResult;
  constructor(public vTestResultUpdated: VehicleTestResultUpdate) {}
}

export class CreateTestResultSuccess implements Action {
  readonly type = EVehicleTestResultActions.CreateTestResultSuccess;
  constructor(public vTestResultUpdated: VehicleTestResultUpdate) {}
}

export type VehicleTestResultActions =
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
  | DownloadCertificate
  | CreateTestResult
  | CreateTestResultSuccess;
