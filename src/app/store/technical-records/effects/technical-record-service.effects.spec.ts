import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState, State } from '@store/index';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
  archiveTechRecord,
  archiveTechRecordFailure,
  archiveTechRecordSuccess,
  changeVehicleType,
  createVehicleRecord,
  createVehicleRecordFailure,
  createVehicleRecordSuccess,
  updateTechRecord,
  updateTechRecordFailure,
  updateTechRecordSuccess
} from '../actions/technical-record-service.actions';
import { editingTechRecord } from '../selectors/technical-record-service.selectors';
import { TechnicalRecordServiceEffects } from './technical-record-service.effects';

describe('TechnicalRecordServiceEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: TechnicalRecordServiceEffects;
  let store: MockStore<State>;
  let techRecordHttpService: TechnicalRecordHttpService;
  let testScheduler: TestScheduler;
  let technicalRecordService: TechnicalRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        TechnicalRecordService,
        TechnicalRecordServiceEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialAppState }),
        { provide: UserService, useValue: { name$: of('name'), id$: of('iod') } }
      ]
    });

    effects = TestBed.inject(TechnicalRecordServiceEffects);
    techRecordHttpService = TestBed.inject(TechnicalRecordHttpService);
    technicalRecordService = TestBed.inject(TechnicalRecordService);
  });

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  describe('createVehicleRecord', () => {
    it('should return a vehicle on successful API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const mockVehicle = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };
        const expectedVehicle = {
          ...mockVehicle
        } as TechRecordType<'get'>;

        // mock action to trigger effect
        actions$ = hot('-a--', {
          a: createVehicleRecord({ vehicle: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as unknown as TechRecordType<'put'> })
        });

        // mock service call
        jest.spyOn(techRecordHttpService, 'createVehicleRecord$').mockReturnValue(cold('--a|', { a: expectedVehicle }));

        // expect effect to return success action
        expectObservable(effects.createVehicleRecord$).toBe('---b', {
          b: createVehicleRecordSuccess({ vehicleTechRecord: expectedVehicle })
        });
      });
    });

    it('should return an error message if not created', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        // mock action to trigger effect
        actions$ = hot('-a--', {
          a: createVehicleRecord({ vehicle: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as unknown as TechRecordType<'put'> })
        });

        // mock service call
        const expectedError = new HttpErrorResponse({ status: 500, statusText: 'Internal server error' });

        jest.spyOn(techRecordHttpService, 'createVehicleRecord$').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.createVehicleRecord$).toBe('---b', {
          b: createVehicleRecordFailure({ error: 'Unable to create vehicle with VIN testVin' })
        });
      });
    });
  });

  describe('updateTechRecords$', () => {
    it('should return a technical record on successful API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const technicalRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as TechRecordType<'get'>;

        // mock action to trigger effect
        actions$ = hot('-a--', { a: updateTechRecord });

        // mock service call
        jest.spyOn(techRecordHttpService, 'updateTechRecords$').mockReturnValue(cold('--a|', { a: technicalRecord }));

        // expect effect to return success action
        expectObservable(effects.updateTechRecord$).toBe('---b', {
          b: updateTechRecordSuccess({ vehicleTechRecord: technicalRecord })
        });
      });
    });

    it('should return an error message if not updated', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        // mock action to trigger effect
        actions$ = hot('-a--', { a: updateTechRecord });

        // mock service call
        const expectedError = new HttpErrorResponse({ status: 500, statusText: 'Internal server error' });
        jest.spyOn(techRecordHttpService, 'updateTechRecords$').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.updateTechRecord$).toBe('---b', {
          b: updateTechRecordFailure({
            error: 'Unable to update technical record null'
          })
        });
      });
    });
  });

  describe('archiveTechRecord', () => {
    it('should return an archived technical record on successful API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const technicalRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as TechRecordType<'get'>;

        // mock action to trigger effect
        actions$ = hot('-a--', { a: archiveTechRecord });

        // mock service call
        jest.spyOn(techRecordHttpService, 'archiveTechnicalRecord$').mockReturnValue(cold('--a|', { a: technicalRecord }));

        // expect effect to return success action
        expectObservable(effects.archiveTechRecord$).toBe('---b', {
          b: archiveTechRecordSuccess({ vehicleTechRecord: technicalRecord })
        });
      });
    });

    it.each([
      [500, 'Internal server error'],
      [400, 'You are not allowed to update an archived tech-record']
    ])('should return an error message if not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        // mock action to trigger effect
        actions$ = hot('-a--', { a: archiveTechRecord });

        // mock service call
        const expectedError = new HttpErrorResponse({ status: 500, statusText: 'Internal server error' });
        jest.spyOn(techRecordHttpService, 'archiveTechnicalRecord$').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.archiveTechRecord$).toBe('---b', {
          b: archiveTechRecordFailure({
            error: 'Unable to archive technical record null'
          })
        });
      });
    });

    describe('generateTechRecordBasedOnSectionTemplates', () => {
      beforeEach(() => {
        store = TestBed.inject(MockStore);
        store.resetSelectors();
        jest.resetModules();
      });

      it('should generate new techRecord based on vehicle type', fakeAsync(() => {
        const techRecordServiceSpy = jest.spyOn(technicalRecordService, 'updateEditingTechRecord');
        const expectedTechRecord = getEmptyTechRecord();

        testScheduler.run(({ hot, expectObservable }) => {
          store.overrideSelector(editingTechRecord, {
            vin: 'foo',
            primaryVrm: 'bar',
            systemNumber: 'foobar',
            createdTimestamp: 'barfoo',
            techRecord_vehicleType: 'lgv'
          } as unknown as TechRecordType<'put'>);
          // mock action to trigger effect
          actions$ = hot('-a--', {
            a: changeVehicleType({
              techRecord_vehicleType: VehicleTypes.CAR
            })
          });

          expectObservable(effects.generateTechRecordBasedOnSectionTemplates$).toBe('-b', {
            b: expectedTechRecord
          });
        });

        flush();
        expect(techRecordServiceSpy).toHaveBeenCalledTimes(1);
        expect(techRecordServiceSpy).toHaveBeenCalledWith(expectedTechRecord);
      }));
    });
  });
});

function getEmptyTechRecord(): V3TechRecordModel {
  return {
    techRecord_createdAt: '',
    techRecord_createdById: null,
    techRecord_createdByName: null,
    techRecord_euVehicleCategory: null,
    techRecord_lastUpdatedAt: null,
    techRecord_lastUpdatedById: null,
    techRecord_lastUpdatedByName: null,
    techRecord_manufactureYear: null,
    techRecord_noOfAxles: 2,
    techRecord_notes: undefined,
    techRecord_applicantDetails_address1: null,
    techRecord_applicantDetails_address2: null,
    techRecord_applicantDetails_address3: null,
    techRecord_applicantDetails_emailAddress: null,
    techRecord_applicantDetails_name: null,
    techRecord_applicantDetails_postCode: null,
    techRecord_applicantDetails_postTown: null,
    techRecord_applicantDetails_telephoneNumber: null,
    techRecord_reasonForCreation: '',
    techRecord_regnDate: null,
    techRecord_statusCode: '',
    techRecord_vehicleConfiguration: 'other',
    techRecord_vehicleSubclass: undefined,
    techRecord_vehicleType: 'car'
  } as unknown as V3TechRecordModel;
}
