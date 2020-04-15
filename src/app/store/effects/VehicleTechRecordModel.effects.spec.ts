import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';

import { MockStore } from '@app/utils';
import { VehicleTechRecordModelEffects } from '@app/store/effects/VehicleTechRecordModel.effects';
import { TechnicalRecordService } from '@app/technical-record-search/technical-record.service';
import { UserService } from '@app/app-user.service';
import {
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess,
  SetSelectedVehicleTechnicalRecord,
  SetSelectedVehicleTechnicalRecordSucess,
  SetViewState
} from '@app/store/actions/VehicleTechRecordModel.actions';
import { GetVehicleTestResultModel } from '../actions/VehicleTestResultModel.actions';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { VEHICLE_TECH_RECORD_SEARCH_ERRORS, VIEW_STATE } from '@app/app.enums';
import { SearchParams } from '@app/models/search-params';
import { SetErrorMessage } from '@app/store/actions/Error.actions';

const mockVehicleTechRecord = (): VehicleTechRecordModel => {
  return {
    systemNumber: '1231243',
    vrms: null,
    vin: 'ABCDEFGH777777',
    techRecord: [],
    metadata: { adrDetails: undefined }
  };
};

const mockSearchParams = (): SearchParams => {
  return {
    searchIdentifier: 'ABCDEFGH777777',
    searchCriteria: 'all'
  };
};

describe('VehicleTechRecordModelEffects', () => {
  let effects: VehicleTechRecordModelEffects;
  let actions$: Observable<Action>;
  let action: Action;

  let navigate: jest.Mock;
  let getTechnicalRecordsAllStatuses: jest.Mock;
  let getUser: jest.Mock;

  const mockSelector = new BehaviorSubject<any>(undefined);
  const store: MockStore = new MockStore(mockSelector);

  beforeEach(() => {
    navigate = jest.fn();
    getTechnicalRecordsAllStatuses = jest.fn();
    getUser = jest.fn();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        VehicleTechRecordModelEffects,
        provideMockActions(() => actions$),
        { provide: Store, useValue: store },
        {
          provide: TechnicalRecordService,
          useValue: { getTechnicalRecordsAllStatuses }
        },
        {
          provide: UserService,
          useValue: { getUser }
        },
        {
          provide: Router,
          useValue: { navigate }
        }
      ]
    });

    effects = TestBed.get(VehicleTechRecordModelEffects);
    jest.spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('getTechnicalRecords$', () => {
    let vehicleTechRecordAllStatusesSuccess: Action;

    beforeEach(() => {
      action = new GetVehicleTechRecordModelHavingStatusAll(mockSearchParams());
      actions$ = hot('-a--', { a: action });
    });

    it('should navigate to multiple records page when multiple records are found', () => {
      const vehicleRecords = [mockVehicleTechRecord(), mockVehicleTechRecord()];
      vehicleTechRecordAllStatusesSuccess = new GetVehicleTechRecordModelHavingStatusAllSuccess(
        vehicleRecords
      );

      const techRecordsAllStatuses$ = cold('-(b)', { b: vehicleRecords });
      const expected$ = cold('--(c)-', { c: vehicleTechRecordAllStatusesSuccess });

      getTechnicalRecordsAllStatuses.mockReturnValue(techRecordsAllStatuses$);

      expect(effects.getTechnicalRecords$).toBeObservable(expected$);
      expect(getTechnicalRecordsAllStatuses).toHaveBeenCalledWith(
        mockSearchParams().searchIdentifier,
        mockSearchParams().searchCriteria
      );
      expect(navigate).toHaveBeenCalledWith(['/multiple-records']);
    });

    it('should dispatch SetSelectedVehicleTechnicalRecord for single record found', () => {
      const vehicleRecords = [mockVehicleTechRecord()];
      vehicleTechRecordAllStatusesSuccess = new GetVehicleTechRecordModelHavingStatusAllSuccess(
        vehicleRecords
      );

      const techRecordsAllStatuses$ = cold('-(b)', { b: vehicleRecords });
      const expected$ = cold('--(c)-', { c: vehicleTechRecordAllStatusesSuccess });
      getTechnicalRecordsAllStatuses.mockReturnValue(techRecordsAllStatuses$);

      expect(effects.getTechnicalRecords$).toBeObservable(expected$);
      expect(store.dispatch).toHaveBeenCalledWith(
        new SetSelectedVehicleTechnicalRecord({
          vehicleRecord: vehicleRecords[0],
          viewState: VIEW_STATE.VIEW_ONLY
        })
      );
    });

    it('should dispatch SetErrorMessage when get api call fails', () => {
      const error = { error: VEHICLE_TECH_RECORD_SEARCH_ERRORS.NOT_FOUND };
      const setError = new SetErrorMessage([VEHICLE_TECH_RECORD_SEARCH_ERRORS.NOT_FOUND]);

      const failed$ = cold('--#', {}, error);
      const expected$ = cold('---e-', { e: setError });
      getTechnicalRecordsAllStatuses.mockReturnValue(failed$);

      expect(effects.getTechnicalRecords$).toBeObservable(expected$);
    });
  });

  describe('setSelectedVehicleTechRecord$', () => {
    beforeEach(() => {
      const vehicleRecordState = {
        vehicleRecord: mockVehicleTechRecord(),
        viewState: VIEW_STATE.VIEW_ONLY
      };
      action = new SetSelectedVehicleTechnicalRecord(vehicleRecordState);
      actions$ = hot('-a--', { a: action });
    });

    it(`should navigate to technical record and dispatch
    SetSelectedVehicleTechnicalRecordSucess, SetViewState, GetVehicleTestResultModel `, () => {
      const setTechSuccess = new SetSelectedVehicleTechnicalRecordSucess(mockVehicleTechRecord());
      const setViewState = new SetViewState(VIEW_STATE.VIEW_ONLY);
      const testRestult = new GetVehicleTestResultModel(mockVehicleTechRecord().systemNumber);

      const expected$ = cold('-(bcd)-', { b: setTechSuccess, c: setViewState, d: testRestult });

      expect(effects.setSelectedVehicleTechRecord$).toBeObservable(expected$);
      expect(navigate).toHaveBeenCalledWith(['/technical-record']);
    });
  });

  // it('setVinOnCreate$ - should call the technicalRecordService service method info with a payload', () => {
  //   const valuePayload = { vin: 'aaa', vrm: 'bbb', vType: 'PSV', error: [] };
  //   const requestErrors = [];
  //   const requests: Observable<any>[] = [of(undefined), of(undefined)];

  //   actions = cold('a', { a: new SetVehicleTechRecordModelOnCreate(valuePayload) });

  //   forkJoin(requests).subscribe((result) => {
  //     try {
  //       expect(result[0]).toBe(undefined);
  //       expect(result[1]).toBe(undefined);
  //     } catch (error) {
  //       fail('forkJoin: ' + error);
  //     }
  //   });

  //   effects.setVinOnCreate$.subscribe(() => {
  //     try {
  //       spyOn(store, 'dispatch');
  //       expect(technicalRecordService.getTechnicalRecordsAllStatuses).toHaveBeenCalledWith(
  //         valuePayload.vin
  //       );
  //       expect(technicalRecordService.getTechnicalRecordsAllStatuses).toHaveBeenCalledWith(
  //         valuePayload.vrm
  //       );
  //       expect(requestErrors).toEqual([]);
  //     } catch (error) {
  //       fail('setVinOnCreate$: ' + error);
  //     }
  //   });
  // });

  // it('setVinOnCreate$ - should return errors for existing VIN & VRM', () => {
  //   const valuePayload = { vin: 'P012301230001', vrm: 'CT70002', vType: 'HGV', error: [] };

  //   effects.setVinOnCreate$.subscribe(() => {
  //     spyOn(store, 'dispatch');
  //     expect(technicalRecordService.getTechnicalRecordsAllStatuses).toHaveBeenCalledWith(
  //       valuePayload.vin
  //     );
  //     expect(technicalRecordService.getTechnicalRecordsAllStatuses).toHaveBeenCalledWith(
  //       valuePayload.vrm
  //     );
  //     expect(store.dispatch).toHaveBeenCalledWith(new SetErrorMessage(['']));
  //   });
  // });

  // it('setVinOnCreate$ - should return errors for existing VIN & VRM', () => {
  //   const valuePayload = { vin: 'P012301230001', vrm: 'CT70002', vType: 'Trailer', error: [] };

  //   effects.setVinOnCreate$.subscribe(() => {
  //     spyOn(store, 'dispatch');
  //     expect(technicalRecordService.getTechnicalRecordsAllStatuses).toHaveBeenCalledWith(
  //       'P012301230001'
  //     );
  //     expect(store.dispatch).toHaveBeenCalledWith(new SetErrorMessage(['']));
  //   });
  // });
});
