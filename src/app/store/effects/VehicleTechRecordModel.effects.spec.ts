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
  GetVehicleTechRecordHavingStatusAll,
  GetVehicleTechRecordHavingStatusAllSuccess,
  SetSelectedVehicleTechnicalRecord,
  SetSelectedVehicleTechRecordSuccess,
  SetViewState,
  CreateVehicleTechRecord,
  UpdateVehicleTechRecord,
  UpdateVehicleTechRecordSuccess
} from '@app/store/actions/VehicleTechRecordModel.actions';
import { GetVehicleTestResultModel } from '../actions/VehicleTestResultModel.actions';
import { TechRecord } from './../../models/tech-record.model';
import {
  VehicleTechRecordModel,
  VehicleTechRecordEdit
} from '@app/models/vehicle-tech-record.model';
import { VEHICLE_TECH_RECORD_SEARCH_ERRORS, VIEW_STATE, RECORD_STATUS } from '@app/app.enums';
import { SearchParams } from '@app/models/search-params';
import { SetErrorMessage } from '@app/store/actions/Error.actions';

const mockVehicleTechRecord = (): VehicleTechRecordModel => {
  return {
    systemNumber: '1231243',
    vrms: null,
    vin: 'ABCDEFGH777777',
    techRecord: [
      {
        statusCode: RECORD_STATUS.CURRENT
      }
    ] as TechRecord[],
    metadata: { adrDetails: undefined }
  };
};

const mockActiveVehicleTechRecord = () => {
  return {
    techRecord: [
      {
        statusCode: RECORD_STATUS.PROVISIONAL
      }
    ] as TechRecord[]
  } as VehicleTechRecordEdit;
};

const mockSearchParams = (): SearchParams => {
  return {
    searchIdentifier: 'ABCDEFGH777777',
    searchCriteria: 'all'
  };
};

const mockVehicleRecordEdit = {
  vin: 'ABCDR1234',
  techRecord: [{}]
} as VehicleTechRecordEdit;

describe('VehicleTechRecordModelEffects', () => {
  let effects: VehicleTechRecordModelEffects;
  let actions$: Observable<Action>;
  let action: Action;

  let navigate: jest.Mock;
  let getTechnicalRecordsAllStatuses: jest.Mock;
  let createTechnicalRecord: jest.Mock;
  let updateVehicleRecord: jest.Mock;
  let getUser: jest.Mock;

  const mockSelector = new BehaviorSubject<any>(undefined);
  const store: MockStore = new MockStore(mockSelector);

  beforeEach(() => {
    navigate = jest.fn();
    getTechnicalRecordsAllStatuses = jest.fn();
    createTechnicalRecord = jest.fn();
    updateVehicleRecord = jest.fn();
    getUser = jest.fn();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        VehicleTechRecordModelEffects,
        provideMockActions(() => actions$),
        { provide: Store, useValue: store },
        {
          provide: TechnicalRecordService,
          useValue: {
            getTechnicalRecordsAllStatuses,
            createTechnicalRecord,
            updateVehicleRecord
          }
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
      action = new GetVehicleTechRecordHavingStatusAll(mockSearchParams());
      actions$ = hot('-a--', { a: action });
    });

    it('should navigate to multiple records page when multiple records are found', () => {
      const vehicleRecords = [mockVehicleTechRecord(), mockVehicleTechRecord()];
      vehicleTechRecordAllStatusesSuccess = new GetVehicleTechRecordHavingStatusAllSuccess(
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
      vehicleTechRecordAllStatusesSuccess = new GetVehicleTechRecordHavingStatusAllSuccess(
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
    SetSelectedVehicleTechRecordSuccess, SetViewState, GetVehicleTestResultModel `, () => {
      const setTechSuccess = new SetSelectedVehicleTechRecordSuccess(mockVehicleTechRecord());
      const setViewState = new SetViewState(VIEW_STATE.VIEW_ONLY);
      const testRestult = new GetVehicleTestResultModel(mockVehicleTechRecord().systemNumber);

      const expected$ = cold('-(bcd)-', { b: setTechSuccess, c: setViewState, d: testRestult });

      expect(effects.setSelectedVehicleTechRecord$).toBeObservable(expected$);
      expect(navigate).toHaveBeenCalledWith(['/technical-record']);
    });
  });

  describe('createTechnicalRecords$', () => {
    beforeEach(() => {
      action = new CreateVehicleTechRecord(mockVehicleRecordEdit);
      actions$ = hot('-a--', { a: action });
    });

    it('should dispatch GetVehicleTechRecordHavingStatusAll on successful create', () => {
      const getTechRecord = new GetVehicleTechRecordHavingStatusAll({
        searchIdentifier: mockVehicleRecordEdit.vin,
        searchCriteria: 'all'
      });

      const createRecord$ = cold('-(b)', { b: 'success' });
      const expected$ = cold('--(c)-', { c: getTechRecord });
      createTechnicalRecord.mockReturnValue(createRecord$);

      expect(effects.createTechnicalRecord$).toBeObservable(expected$);
      expect(createTechnicalRecord).toHaveBeenCalledWith(mockVehicleRecordEdit);
    });

    it('should dispatch SetErrorMessage when create api call fails', () => {
      const error = { error: { errors: ['error1', 'error2'] } };
      const setError = new SetErrorMessage(error.error.errors);

      const failed$ = cold('--#', {}, error);
      const expected$ = cold('---e-', { e: setError });
      createTechnicalRecord.mockReturnValue(failed$);

      expect(effects.createTechnicalRecord$).toBeObservable(expected$);
    });
  });

  describe('updateVehicleRecord$', () => {
    let recordStatusChanged: VehicleTechRecordEdit;
    beforeEach(() => {
      recordStatusChanged = {
        ...mockVehicleRecordEdit
      };
      recordStatusChanged.techRecord = [
        {
          statusCode: RECORD_STATUS.CURRENT
        }
      ] as TechRecord[];

      action = new UpdateVehicleTechRecord(recordStatusChanged);
      actions$ = hot('-a--', { a: action });

      mockSelector.next({
        getActiveVehicleTechRecord: () => mockActiveVehicleTechRecord(),
        getSelectedVehicleTechRecord: mockVehicleTechRecord()
      });
    });

    it(`should dispatch UpdateVehicleTechRecordSuccess, SetSelectedVehicleTechRecordSuccess, SetViewState `, () => {
      const savedRecord = mockVehicleTechRecord();
      const updateTechRecord = new UpdateVehicleTechRecordSuccess(mockVehicleTechRecord());
      const setTechSuccess = new SetSelectedVehicleTechRecordSuccess(mockVehicleTechRecord());
      const setViewState = new SetViewState(VIEW_STATE.VIEW_ONLY);

      const updatedRecord$ = cold('-(b)', { b: savedRecord });
      const expected$ = cold('--(cde)-', {
        c: updateTechRecord,
        d: setTechSuccess,
        e: setViewState
      });
      updateVehicleRecord.mockReturnValue(updatedRecord$);

      expect(effects.updateVehicleRecord$).toBeObservable(expected$);
      expect(updateVehicleRecord).toHaveBeenCalledWith({
        vehicleRecord: {
          vin: 'ABCDR1234',
          techRecord: [{ statusCode: 'current' }],
          msUserDetails: {}
        },
        systemNumber: '1231243',
        oldStatusCode: 'provisional'
      });
    });

    it('should dispatch SetErrorMessage when update api call fails', () => {
      const error = { error: { errors: ['error1', 'error2'] } };
      const setError = new SetErrorMessage(error.error.errors);

      const failed$ = cold('--#', {}, error);
      const expected$ = cold('---e-', { e: setError });
      updateVehicleRecord.mockReturnValue(failed$);

      expect(effects.updateVehicleRecord$).toBeObservable(expected$);
    });
  });
});
