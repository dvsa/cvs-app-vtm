import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { mockVehicleTechnicalRecordList } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState, State } from '@store/.';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
  changeVehicleType,
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
  updateEditingTechRecord,
  updateTechRecords,
  updateTechRecordsFailure,
  updateTechRecordsSuccess
} from '../actions/technical-record-service.actions';
import { TechnicalRecordServiceEffects } from './technical-record-service.effects';
import { createMock } from 'ts-auto-mock';
import { TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { editableTechRecord, editableVehicleTechRecord } from '@store/technical-records';

describe('TechnicalRecordServiceEffects', () => {
  let effects: TechnicalRecordServiceEffects;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let technicalRecordService: TechnicalRecordService;
  let store: MockStore<State>;
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
        expectObservable(effects.addProvisionalTechRecord).toBe('---b', {
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

        expectObservable(effects.addProvisionalTechRecord).toBe('---b', {
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
        expectObservable(effects.addProvisionalTechRecord).toBe('---b', {
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

        expectObservable(effects.addProvisionalTechRecord).toBe('---b', {
          b: createProvisionalTechRecordFailure({
            error: 'Unable to create a new provisional record null'
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
        const expectedTechRecord = {
          alterationMarker: '',
          approvalType: undefined,
          approvalTypeNumber: undefined,
          axles: [],
          bodyMake: '',
          bodyModel: '',
          bodyType: {
            description: ''
          },
          brakes: {
            brakeCode: '',
            brakeCodeOriginal: '',
            dataTrBrakeOne: '',
            dataTrBrakeThree: '',
            dataTrBrakeTwo: '',
            dtpNumber: '',
            retarderBrakeOne: '',
            retarderBrakeTwo: ''
          },
          chassisMake: '',
          chassisModel: '',
          coifCertifierName: undefined,
          coifDate: undefined,
          coifSerialNumber: undefined,
          conversionRefNo: '',
          dda: null,
          departmentalVehicleMarker: '',
          dimensions: {
            height: null,
            length: null,
            width: null
          },
          dispensations: undefined,
          emissionsLimit: null,
          euVehicleCategory: '',
          euroStandard: undefined,
          frontAxleToRearAxle: null,
          fuelPropulsionSystem: '',
          functionCode: '',
          grossDesignWeight: '',
          grossGbWeight: '',
          grossKerbWeight: '',
          grossLadenWeight: '',
          manufactureYear: '',
          maxTrainGbWeight: null,
          microfilm: null,
          modelLiteral: '',
          noOfAxles: '',
          numberOfWheelsDriven: null,
          ntaNumber: undefined,
          numberOfSeatbelts: '',
          regnDate: '',
          remarks: undefined,
          reasonForCreation: undefined,
          seatbeltInstallationApprovalDate: '',
          seatsLowerDeck: '',
          seatsUpperDeck: '',
          speedLimiterMrk: '',
          speedRestriction: '',
          standingCapacity: '',
          statusCode: '',
          tachoExemptMrk: '',
          trainDesignWeight: null,
          unladenWeight: '',
          variantNumber: undefined,
          variantVersionNumber: undefined,
          vehicleClass: {
            description: ''
          },
          vehicleConfiguration: '',
          vehicleSize: '',
          vehicleType: VehicleTypes.PSV
        } as unknown as TechRecordModel;

        testScheduler.run(({ hot, expectObservable }) => {
          const techRecord = createMock<TechRecordModel>({
            vehicleType: VehicleTypes.HGV
          });

          store.overrideSelector(editableVehicleTechRecord, { vin: '', vrms: [], systemNumber: '', techRecord: [techRecord] });
          // mock action to trigger effect
          actions$ = hot('-a--', {
            a: changeVehicleType({
              vehicleType: VehicleTypes.PSV
            })
          });

          expectObservable(effects.generateTechRecordBasedOnSectionTemplates).toBe('-b', {
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
