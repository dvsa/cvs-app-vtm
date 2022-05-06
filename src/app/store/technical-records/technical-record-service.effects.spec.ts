import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { mockVehicleTechnicalRecordList } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/.';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { getByVIN, getByVINFailure, getByVINSuccess } from './technical-record-service.actions';
import { TechnicalRecordServiceEffects } from './technical-record-service.effects';

describe('TechnicalRecordServiceEffects', () => {
  let effects: TechnicalRecordServiceEffects;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let technicalRecordService: TechnicalRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TechnicalRecordServiceEffects, provideMockActions(() => actions$), TechnicalRecordService, provideMockStore({ initialState: initialAppState })]
    });

    effects = TestBed.inject(TechnicalRecordServiceEffects);
    technicalRecordService = TestBed.inject(TechnicalRecordService);
  });

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('return error messages', () => {
    it('should return getByVIN action on successfull API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const testResults = mockVehicleTechnicalRecordList();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByVIN });

        // mock service call
        jest.spyOn(technicalRecordService, 'getByVIN').mockReturnValue(cold('--a|', { a: testResults }));

        // expect effect to return success action
        expectObservable(effects.getByVin$).toBe('---b', {
          b: getByVINSuccess({ vehicleTechRecords: testResults })
        });
      });
    });

    it('should return generic error message if not not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const vehicleTechRecords = {vin: 'vin'};
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByVIN( vehicleTechRecords ) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 500,
          statusText: 'Internal server error'
        });
        jest.spyOn(technicalRecordService, 'getByVIN').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getByVin$).toBe('---b', { b: getByVINFailure({ error: 'There was a problem getting the Tech Record by VIN', anchorLink: 'search-term' }) });
      });
    });

    it('should return not found error message if not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const vehicleTechRecords = {vin: 'vin'};
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByVIN( vehicleTechRecords ) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 404,
          statusText: 'Vehicle not found'
        });
        jest.spyOn(technicalRecordService, 'getByVIN').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getByVin$).toBe('---b', { b: getByVINFailure({ error: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number', anchorLink: 'search-term' }) });
      });
    });
  });
});
