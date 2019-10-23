import {Action} from '@ngrx/store';
import {TestResultModel} from '@app/models/test-result.model';

export enum EVehicleTestResultModelActions {
  GetVehicleTestResultModel = '[TestResultModel] Get TestResultModel',
  GetVehicleTestResultModelSuccess = '[TestResultModel] Get TestResultModel Success',
}

export class GetVehicleTestResultModel implements Action {
  public readonly type = EVehicleTestResultModelActions.GetVehicleTestResultModel;
  constructor(public payload: any) {
  }
}

export class GetVehicleTestResultModelSuccess implements Action {
  public readonly type = EVehicleTestResultModelActions.GetVehicleTestResultModelSuccess;
  constructor(public  payload: TestResultModel) {
  }
}

export type VehicleTestResultModelActions = GetVehicleTestResultModel | GetVehicleTestResultModelSuccess;
