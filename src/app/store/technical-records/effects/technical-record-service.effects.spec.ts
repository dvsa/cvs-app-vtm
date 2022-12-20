import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { mockVehicleTechnicalRecordList } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/.';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
  createProvisionalTechRecord,
  createProvisionalTechRecordFailure,
  createProvisionalTechRecordSuccess,
  getByAll,
  getByAllFailure,
  getByAllSuccess,
  getByPartialVin,
  getByPartialVinFailure,
  getByPartialVinSuccess,
  getBySystemNumber,
  getBySystemNumberFailure,
  getBySystemNumberSuccess,
  getByTrailerId,
  getByTrailerIdFailure,
  getByTrailerIdSuccess,
  getByVin,
  getByVinFailure,
  getByVinSuccess,
  getByVrm,
  getByVrmFailure,
  getByVrmSuccess,
  updateTechRecords,
  updateTechRecordsFailure,
  updateTechRecordsSuccess
} from '../actions/technical-record-service.actions';
import { TechnicalRecordServiceEffects } from './technical-record-service.effects';

describe('TechnicalRecordServiceEffects', () => {
  let effects: TechnicalRecordServiceEffects;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let technicalRecordService: TechnicalRecordService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        TechnicalRecordServiceEffects,
        provideMockActions(() => actions$),
        TechnicalRecordService,
        provideMockStore({ initialState: initialAppState }),
        { provide: UserService, useValue: { name$: of('name'), id$: of('iod') } }
      ]
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
          b: getByVinSuccess({ vehicleTechRecords: technicalRecord })
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

        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getByVinFailure({ error: 'There was a problem getting the Tech Record by vin', anchorLink: 'search-term' })
        });
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

        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getByVinFailure({
            error: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number',
            anchorLink: 'search-term'
          })
        });
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
          b: getByPartialVinSuccess({ vehicleTechRecords: technicalRecord })
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

        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getByPartialVinFailure({ error: 'There was a problem getting the Tech Record by partialVin', anchorLink: 'search-term' })
        });
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

        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getByPartialVinFailure({
            error: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number',
            anchorLink: 'search-term'
          })
        });
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
          b: getByVrmSuccess({ vehicleTechRecords: technicalRecord })
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

        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getByVrmFailure({ error: 'There was a problem getting the Tech Record by vrm', anchorLink: 'search-term' })
        });
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

        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getByVrmFailure({
            error: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number',
            anchorLink: 'search-term'
          })
        });
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
          b: getByTrailerIdSuccess({ vehicleTechRecords: technicalRecord })
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

        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getByTrailerIdFailure({ error: 'There was a problem getting the Tech Record by trailerId', anchorLink: 'search-term' })
        });
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

        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getByTrailerIdFailure({
            error: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number',
            anchorLink: 'search-term'
          })
        });
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

  describe('getBySystemNumber$', () => {
    it('should return a technical record on successfull API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const technicalRecord = mockVehicleTechnicalRecordList();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: getBySystemNumber({ systemNumber: 'PSV' }) });

        // mock service call
        jest.spyOn(technicalRecordService, 'getBySystemNumber').mockReturnValue(cold('--a|', { a: technicalRecord }));

        // expect effect to return success action
        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getBySystemNumberSuccess({ vehicleTechRecords: technicalRecord })
        });
      });
    });

    it('should return generic error message if not not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getBySystemNumber({ systemNumber: 'systemNumber' }) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 500,
          statusText: 'Internal server error'
        });
        jest.spyOn(technicalRecordService, 'getBySystemNumber').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getBySystemNumberFailure({ error: 'There was a problem getting the Tech Record by systemNumber', anchorLink: 'search-term' })
        });
      });
    });

    it('should return not found error message if not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getBySystemNumber({ systemNumber: 'systemNumber' }) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 404,
          statusText: 'Vehicle not found'
        });
        jest.spyOn(technicalRecordService, 'getBySystemNumber').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getBySystemNumberFailure({
            error: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number',
            anchorLink: 'search-term'
          })
        });
      });
    });

    it('should return error message if error is a string', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getBySystemNumber({ systemNumber: 'systemNumber' }) });

        // mock service call
        const expectedError = 'string';
        jest.spyOn(technicalRecordService, 'getBySystemNumber').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getBySystemNumberFailure({ error: 'string', anchorLink: 'search-term' })
        });
      });
    });
  });

  describe('getByAll$', () => {
    it('should return a technical record on successfull API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const technicalRecord = mockVehicleTechnicalRecordList();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByAll });

        // mock service call
        jest.spyOn(technicalRecordService, 'getByAll').mockReturnValue(cold('--a|', { a: technicalRecord }));

        // expect effect to return success action
        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getByAllSuccess({ vehicleTechRecords: technicalRecord })
        });
      });
    });

    it('should return generic error message if not not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const all = { all: 'all' };
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByAll(all) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 500,
          statusText: 'Internal server error'
        });
        jest.spyOn(technicalRecordService, 'getByAll').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getByAllFailure({ error: 'There was a problem getting the Tech Record by the current search criteria', anchorLink: 'search-term' })
        });
      });
    });

    it('should return not found error message if not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const all = { all: 'all' };
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByAll(all) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 404,
          statusText: 'Vehicle not found'
        });
        jest.spyOn(technicalRecordService, 'getByAll').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getByAllFailure({
            error: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number',
            anchorLink: 'search-term'
          })
        });
      });
    });

    it('should return error message if error is a string', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const all = { all: 'all' };
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByAll(all) });

        // mock service call
        const expectedError = 'string';
        jest.spyOn(technicalRecordService, 'getByAll').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', { b: getByAllFailure({ error: 'string', anchorLink: 'search-term' }) });
      });
    });
  });

  describe('updateTechnicalRecord$', () => {
    it('should return a technical record on successful API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const technicalRecord = mockVehicleTechnicalRecordList();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: updateTechRecords });

        // mock service call
        jest.spyOn(technicalRecordService, 'putUpdateTechRecords').mockReturnValue(cold('--a|', { a: technicalRecord[0] }));

        // expect effect to return success action
        expectObservable(effects.updateTechnicalRecord$).toBe('---b', {
          b: updateTechRecordsSuccess({ vehicleTechRecords: technicalRecord })
        });
      });
    });

    it('should return an error message if not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        // mock action to trigger effect
        actions$ = hot('-a--', { a: updateTechRecords });

        // mock service call
        const expectedError = new HttpErrorResponse({ status: 500, statusText: 'Internal server error' });
        jest.spyOn(technicalRecordService, 'putUpdateTechRecords').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.updateTechnicalRecord$).toBe('---b', {
          b: updateTechRecordsFailure({
            error: 'Unable to update technical record null'
          })
        });
      });
    });
  });

  describe('postProvisionalTechRecord$', () => {
    it('should return a technical record on successful API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const technicalRecord = mockVehicleTechnicalRecordList();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: createProvisionalTechRecord });

        // mock service call
        jest.spyOn(technicalRecordService, 'postProvisionalTechRecord').mockReturnValue(cold('--a|', { a: technicalRecord[0] }));

        // expect effect to return success action
        expectObservable(effects.postProvisionalTechRecord).toBe('---b', {
          b: createProvisionalTechRecordSuccess({ vehicleTechRecords: technicalRecord })
        });
      });
    });

    it('should return an error message if not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        // mock action to trigger effect
        actions$ = hot('-a--', { a: createProvisionalTechRecord });

        // mock service call
        const expectedError = new HttpErrorResponse({ status: 500, statusText: 'Internal server error' });
        jest.spyOn(technicalRecordService, 'postProvisionalTechRecord').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.postProvisionalTechRecord).toBe('---b', {
          b: createProvisionalTechRecordFailure({
            error: 'Unable to create a new provisional record null'
          })
        });
      });
    });
  });

  describe('archiveTechRecord', () => {
    it('should return an archived technical record on successful API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const technicalRecord = mockVehicleTechnicalRecordList();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: createProvisionalTechRecord });

        // mock service call
        jest.spyOn(technicalRecordService, 'postProvisionalTechRecord').mockReturnValue(cold('--a|', { a: technicalRecord[0] }));

        // expect effect to return success action
        expectObservable(effects.postProvisionalTechRecord).toBe('---b', {
          b: createProvisionalTechRecordSuccess({ vehicleTechRecords: technicalRecord })
        });
      });
    });

    it.each([
      [500, 'Internal server error'],
      [400, 'You are not allowed to update an archived tech-record']
    ])('should return an error message if not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        // mock action to trigger effect
        actions$ = hot('-a--', { a: createProvisionalTechRecord });

        // mock service call
        const expectedError = new HttpErrorResponse({ status: 500, statusText: 'Internal server error' });
        jest.spyOn(technicalRecordService, 'postProvisionalTechRecord').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.postProvisionalTechRecord).toBe('---b', {
          b: createProvisionalTechRecordFailure({
            error: 'Unable to create a new provisional record null'
          })
        });
      });
    });
  });
});
