import { Action } from '@ngrx/store';
import { TestResultModel } from '../../models/test-result.model';

export enum EVehicleTestResultModelActions {
  GetVehicleTestResultModel = '[TestResultModel] Get TestResultModel',
  GetVehicleTestResultModelSuccess = '[TestResultModel] Get TestResultModel Success',
  GetVehicleTestResultModelFailure = '[TestResultModel] Get TestResultModel Failure',
}

export class GetVehicleTestResultModel implements Action {
  public readonly type = EVehicleTestResultModelActions.GetVehicleTestResultModel;
  constructor(public payload: any) {
  }
}

export class GetVehicleTestResultModelSuccess implements Action {
  public readonly type = EVehicleTestResultModelActions.GetVehicleTestResultModelSuccess;
  constructor(public payload: TestResultModel) {
  }
}

export class GetVehicleTestResultModelFailure implements Action {
  public readonly type = EVehicleTestResultModelActions.GetVehicleTestResultModelFailure;
  constructor(public payload: any) {
  }
}

export type VehicleTestResultModelActions = GetVehicleTestResultModel | GetVehicleTestResultModelSuccess | GetVehicleTestResultModelFailure;
