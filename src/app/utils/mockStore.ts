import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Action } from '@ngrx/store';
import { getErrors } from '@app/store/selectors/error.selectors';
import {
  getSelectedVehicleTechRecord,
  getTechViewState,
  getCreateState,
  getVehicleTechRecordMetaData,
  getActiveVehicleTechRecord
} from '@app/store/selectors/VehicleTechRecordModel.selectors';

export class MockStore {
  mockSelector: BehaviorSubject<any>;

  constructor(mockSelector) {
    this.mockSelector = mockSelector;
  }

  select(selector: any) {
    switch (selector) {
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
              : {}
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

      case getCreateState:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getCreateState') ? value['getCreateState'] : {}
          )
        );

      case getErrors:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getErrors') ? value['getErrors'] : []
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
