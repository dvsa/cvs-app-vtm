import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Action } from '@ngrx/store';
import { getErrors } from '@app/store/selectors/error.selectors';
import {
  getSelectedVehicleTechRecord,
  getTechViewState,
  getVehicleTechRecordMetaData,
  getActiveVehicleTechRecord,
  selectVehicleTechRecordModelHavingStatusAll
} from '@app/store/selectors/VehicleTechRecordModel.selectors';
import {
  getSelectedVehicleTestResultModel,
  getTestViewState,
  getVehicleTestResultModel,
  selectTestTypeById
} from '@app/store/selectors/VehicleTestResultModel.selectors';
import { getPreparers, getTestStations } from '@app/store/selectors/ReferenceData.selectors';
import { getRouterParams } from '@app/store/selectors/route.selectors';
import { getCurrentModalState } from '@app/modal/modal.selectors';
import { getAppFormState } from '@app/store/selectors/app-form-state.selectors';

export class MockStore {
  mockSelector: BehaviorSubject<any>;

  constructor(mockSelector) {
    this.mockSelector = mockSelector;
  }

  select(selector: any) {
    switch (selector) {
      case selectVehicleTechRecordModelHavingStatusAll:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('selectVehicleTechRecordModelHavingStatusAll')
              ? value['selectVehicleTechRecordModelHavingStatusAll']
              : []
          )
        );

      case getSelectedVehicleTechRecord:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getSelectedVehicleTechRecord')
              ? value['getSelectedVehicleTechRecord']
              : {}
          )
        );

      case getActiveVehicleTechRecord:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getActiveVehicleTechRecord')
              ? value['getActiveVehicleTechRecord']
              : () => {}
          )
        );

      case getVehicleTechRecordMetaData:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getVehicleTechRecordMetaData')
              ? value['getVehicleTechRecordMetaData']
              : {}
          )
        );

      case getTechViewState:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getTechViewState') ? value['getTechViewState'] : {}
          )
        );

      case getErrors:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getErrors') ? value['getErrors'] : []
          )
        );

      case getVehicleTestResultModel:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getVehicleTestResultModel')
              ? value['getVehicleTestResultModel']
              : []
          )
        );

      case selectTestTypeById(''):
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('selectTestTypeById') ? value['selectTestTypeById'] : {}
          )
        );

      case getPreparers:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getPreparers') ? value['getPreparers'] : null
          )
        );

      case getTestStations:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getTestStations') ? value['getTestStations'] : null
          )
        );

      case getTestViewState:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getTestViewState') ? value['getTestViewState'] : {}
          )
        );

      case getSelectedVehicleTestResultModel:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getSelectedVehicleTestResultModel')
              ? value['getSelectedVehicleTestResultModel']
              : {}
          )
        );

      case getRouterParams:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getRouterParams') ? value['getRouterParams'] : {}
          )
        );
        case getCurrentModalState:
          return this.mockSelector.pipe(
            map((value: any) =>
              value && value.hasOwnProperty('getCurrentModalState')
                ? value['getCurrentModalState']
                : {}
            )
          );
        case getAppFormState:
          return this.mockSelector.pipe(
            map((value: any) =>
              value && value.hasOwnProperty('getCurrentModalState')
                ? value['getCurrentModalState']
                : {}
            )
          );

      default:
        return this.mockSelector;
    }
  }

  dispatch(action: Action) {
    return [];
  }
}
