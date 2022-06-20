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
import { getByPartialVin, getByPartialVinFailure, getByPartialVinSuccess, getByTrailerId, getByTrailerIdFailure, getByTrailerIdSuccess, getByVin, getByVinFailure, getByVinSuccess, getByVrm, getByVrmFailure, getByVrmSuccess } from '../actions/technical-record-service.actions';
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

  describe('getByVin$', () => {
    it('should return a technical record on successfull API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const technicalRecord = mockVehicleTechnicalRecordList();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByVin });

        // mock service call
        jest.spyOn(technicalRecordService, 'getByVin').mockReturnValue(cold('--a|', { a: technicalRecord }));

        // expect effect to return success action
        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getByVinSuccess({ records: technicalRecord })
        });
      });
    });

    it('should return generic error message if not not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const vin = { vin: 'vin' };
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByVin(vin) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 500,
          statusText: 'Internal server error'
        });
        jest.spyOn(technicalRecordService, 'getByVin').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', { b: getByVinFailure({ error: 'There was a problem getting the Tech Record by vin', anchorLink: 'search-term' }) });
      });
    });

    it('should return not found error message if not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const vin = { vin: 'vin' };
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByVin(vin) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 404,
          statusText: 'Vehicle not found'
        });
        jest.spyOn(technicalRecordService, 'getByVin').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', { b: getByVinFailure({ error: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number', anchorLink: 'search-term' }) });
      });
    });

    it('should return error message if error is a string', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const vin = { vin: 'vin' };
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByVin(vin) });

        // mock service call
        const expectedError = 'string';
        jest.spyOn(technicalRecordService, 'getByVin').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', { b: getByVinFailure({ error: 'string', anchorLink: 'search-term' }) });
      });
    });
  });

  describe('getByPartialVin$', () => {
    it('should return a technical record on successfull API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const technicalRecord = mockVehicleTechnicalRecordList();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByPartialVin });

        // mock service call
        jest.spyOn(technicalRecordService, 'getByPartialVin').mockReturnValue(cold('--a|', { a: technicalRecord }));

        // expect effect to return success action
        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getByPartialVinSuccess({ records: technicalRecord })
        });
      });
    });

    it('should return generic error message if not not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const vin = { partialVin: 'vin' };
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByPartialVin(vin) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 500,
          statusText: 'Internal server error'
        });
        jest.spyOn(technicalRecordService, 'getByPartialVin').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', { b: getByPartialVinFailure({ error: 'There was a problem getting the Tech Record by partialVin', anchorLink: 'search-term' }) });
      });
    });

    it('should return not found error message if not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const vin = { partialVin: 'vin' };
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByPartialVin(vin) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 404,
          statusText: 'Vehicle not found'
        });
        jest.spyOn(technicalRecordService, 'getByPartialVin').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', { b: getByPartialVinFailure({ error: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number', anchorLink: 'search-term' }) });
      });
    });

    it('should return error message if error is a string', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const vin = { partialVin: 'vin' };
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByPartialVin(vin) });

        // mock service call
        const expectedError = 'string';
        jest.spyOn(technicalRecordService, 'getByPartialVin').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', { b: getByPartialVinFailure({ error: 'string', anchorLink: 'search-term' }) });
      });
    });
  });

  describe('getByVrm$', () => {
    it('should return a technical record on successfull API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const technicalRecord = mockVehicleTechnicalRecordList();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByVrm });

        // mock service call
        jest.spyOn(technicalRecordService, 'getByVrm').mockReturnValue(cold('--a|', { a: technicalRecord }));

        // expect effect to return success action
        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getByVrmSuccess({ records: technicalRecord })
        });
      });
    });

    it('should return generic error message if not not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const vrm = { vrm: 'vrm' };
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByVrm(vrm) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 500,
          statusText: 'Internal server error'
        });
        jest.spyOn(technicalRecordService, 'getByVrm').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', { b: getByVrmFailure({ error: 'There was a problem getting the Tech Record by vrm', anchorLink: 'search-term' }) });
      });
    });

    it('should return not found error message if not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const vrm = { vrm: 'vrm' };
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByVrm(vrm) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 404,
          statusText: 'Vehicle not found'
        });
        jest.spyOn(technicalRecordService, 'getByVrm').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', { b: getByVrmFailure({ error: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number', anchorLink: 'search-term' }) });
      });
    });

    it('should return error message if error is a string', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const vrm = { vrm: 'vrm' };
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByVrm(vrm) });

        // mock service call
        const expectedError = 'string';
        jest.spyOn(technicalRecordService, 'getByVrm').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', { b: getByVrmFailure({ error: 'string', anchorLink: 'search-term' }) });
      });
    });
  });

  describe('getByTrailerId$', () => {
    it('should return a technical record on successfull API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const technicalRecord = mockVehicleTechnicalRecordList();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByTrailerId });

        // mock service call
        jest.spyOn(technicalRecordService, 'getByTrailerId').mockReturnValue(cold('--a|', { a: technicalRecord }));

        // expect effect to return success action
        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getByTrailerIdSuccess({ records: technicalRecord })
        });
      });
    });

    it('should return generic error message if not not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const trailerId = { trailerId: 'trailerId' };
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByTrailerId(trailerId) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 500,
          statusText: 'Internal server error'
        });
        jest.spyOn(technicalRecordService, 'getByTrailerId').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', { b: getByTrailerIdFailure({ error: 'There was a problem getting the Tech Record by trailerId', anchorLink: 'search-term' }) });
      });
    });

    it('should return not found error message if not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const trailerId = { trailerId: 'trailerId' };
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByTrailerId(trailerId) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 404,
          statusText: 'Vehicle not found'
        });
        jest.spyOn(technicalRecordService, 'getByTrailerId').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', { b: getByTrailerIdFailure({ error: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number', anchorLink: 'search-term' }) });
      });
    });

    it('should return error message if error is a string', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const trailerId = { trailerId: 'trailerId' };
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByTrailerId(trailerId) });

        // mock service call
        const expectedError = 'string';
        jest.spyOn(technicalRecordService, 'getByTrailerId').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', { b: getByTrailerIdFailure({ error: 'string', anchorLink: 'search-term' }) });
      });
    });
  });
});
