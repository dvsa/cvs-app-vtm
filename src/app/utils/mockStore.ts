import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Action } from '@ngrx/store';
import { getErrors } from '@app/store/selectors/error.selectors';
import {
  getTestViewState,
  getVehicleTestResultModel,
  selectTestTypeById
} from '@app/store/selectors/VehicleTestResultModel.selectors';
import { getPreparers, getTestStations } from '@app/store/selectors/ReferenceData.selectors';

export class MockStore {
  mockSelector: BehaviorSubject<any>;
  testTypeId: string;

  constructor(mockSelector, testTypeId?: string) {
    this.mockSelector = mockSelector;
    this.testTypeId = testTypeId;
  }

  select(selector: any) {
    switch (selector) {
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

      case selectTestTypeById(this.testTypeId):
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('selectTestTypeById') ? value['selectTestTypeById'] : {}
          )
        );

      case getPreparers:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getPreparers') ? value['getPreparers'] : []
          )
        );

      case getTestStations:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getTestStations') ? value['getTestStations'] : []
          )
        );

      case getTestViewState:
        return this.mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getTestViewState') ? value['getTestViewState'] : {}
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
