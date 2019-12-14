import { Action } from '@ngrx/store';
import { VehicleTechRecordModel } from '../../models/vehicle-tech-record.model';

export enum EVehicleTechRecordModelActions {
  GetVehicleTechRecordModel = '[VehicleTechRecordModel] Get VehicleTechRecordModel',
  GetVehicleTechRecordModelSuccess = '[VehicleTechRecordModel] Get VehicleTechRecordModel Success',
  GetVehicleTechRecordModelHavingStatusAll = '[VehicleTechRecordModel] Get VehicleTechRecordModelHavingStatusAll',
  GetVehicleTechRecordModelHavingStatusAllSuccess = '[VehicleTechRecordModel] Get VehicleTechRecordModelHavingStatusAll Success',
  GetVehicleTechRecordModelHavingStatusAllFailure = '[VehicleTechRecordModel] Get VehicleTechRecordModelHavingStatusAll Failure'
}

export class GetVehicleTechRecordModel implements Action {
  public readonly type = EVehicleTechRecordModelActions.GetVehicleTechRecordModel;
  constructor(public payload: any) {
  }
}

export class GetVehicleTechRecordModelSuccess implements Action {
  public readonly type = EVehicleTechRecordModelActions.GetVehicleTechRecordModelSuccess;
  constructor(public payload: VehicleTechRecordModel) {
  }
}

export class GetVehicleTechRecordModelHavingStatusAll implements Action {
  public readonly type = EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAll;
  constructor(public payload: any) {
  }
}

export class GetVehicleTechRecordModelHavingStatusAllSuccess implements Action {
  public readonly type = EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAllSuccess;
  constructor(public payload: VehicleTechRecordModel) {
  }
}

export class GetVehicleTechRecordModelHavingStatusAllFailure implements Action {
  public readonly type = EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAllFailure;
  constructor(public payload: any) {
  }
}

export class DownloadDocumentFileAction implements Action {
  static readonly TYPE = 'technicalRecords/DOWNLOAD_DOCUMENT_FILE';
  readonly type = DownloadDocumentFileAction.TYPE;
  constructor(public filename: string) {
  }
}

export class DownloadDocumentFileActionSuccess implements Action {
  static readonly TYPE = 'technicalRecords/DOWNLOAD_DOCUMENT_FILE_SUCCESS';
  readonly type = DownloadDocumentFileActionSuccess.TYPE;
  constructor(public payload:any) {
  }
}

export class DownloadDocumentFileActionFailure implements Action {
  static readonly TYPE = 'technicalRecords/DOWNLOAD_DOCUMENT_FILE_FAILURE';
  readonly type = DownloadDocumentFileActionFailure.TYPE;
  constructor(public payload:any) {
  }
}


export type VehicleTechRecordModelActions = GetVehicleTechRecordModel | GetVehicleTechRecordModelSuccess |
  GetVehicleTechRecordModelHavingStatusAll | GetVehicleTechRecordModelHavingStatusAllSuccess |
  GetVehicleTechRecordModelHavingStatusAllFailure;
