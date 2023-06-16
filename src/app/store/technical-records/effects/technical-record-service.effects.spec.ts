import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { mockVehicleTechnicalRecordList } from '@mocks/mock-vehicle-technical-record.mock';
import { PostNewVehicleModel, TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState, State } from '@store/index';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { createMock } from 'ts-auto-mock';
import {
  changeVehicleType,
  createProvisionalTechRecord,
  createProvisionalTechRecordFailure,
  createProvisionalTechRecordSuccess,
  createVehicleRecord,
  createVehicleRecordFailure,
  createVehicleRecordSuccess,
  getBySystemNumber,
  getBySystemNumberFailure,
  getBySystemNumberSuccess,
  updateTechRecords,
  updateTechRecordsFailure,
  updateTechRecordsSuccess
} from '../actions/technical-record-service.actions';
import { editableVehicleTechRecord } from '../selectors/technical-record-service.selectors';
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

  describe('getBySystemNumber$', () => {
    it('should return a technical record on successfull API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const technicalRecord = mockVehicleTechnicalRecordList();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: getBySystemNumber({ systemNumber: 'PSV' }) });

        // mock service call
        jest.spyOn(techRecordHttpService, 'getBySystemNumber').mockReturnValue(cold('--a|', { a: technicalRecord }));

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
        jest.spyOn(techRecordHttpService, 'getBySystemNumber').mockReturnValue(cold('--#|', {}, expectedError));

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
        jest.spyOn(techRecordHttpService, 'getBySystemNumber').mockReturnValue(cold('--#|', {}, expectedError));

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
        jest.spyOn(techRecordHttpService, 'getBySystemNumber').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getTechnicalRecord$).toBe('---b', {
          b: getBySystemNumberFailure({ error: 'string', anchorLink: 'search-term' })
        });
      });
    });
  });

  describe('createVehicleRecord', () => {
    it('should return a vehicle on successful API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const mockVehicle = mockVehicleTechnicalRecordList()[0];
        const expectedVehicle: PostNewVehicleModel = {
          ...mockVehicle,
          primaryVrm: mockVehicle.vrms.find(vrm => vrm.isPrimary)?.vrm,
          secondaryVrms: mockVehicle.vrms.filter(vrm => !vrm.isPrimary).map(vrm => vrm.vrm)
        };

        // mock action to trigger effect
        actions$ = hot('-a--', { a: createVehicleRecord({ vehicle: { vin: 'xxx', techRecord: [{}] } as VehicleTechRecordModel }) });

        // mock service call
        jest.spyOn(techRecordHttpService, 'createVehicleRecord').mockReturnValue(cold('--a|', { a: expectedVehicle }));

        // expect effect to return success action
        expectObservable(effects.createVehicleRecord$).toBe('---b', {
          b: createVehicleRecordSuccess({ vehicleTechRecords: [expectedVehicle] })
        });
      });
    });

    it('should return an error message if not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        // mock action to trigger effect
        actions$ = hot('-a--', { a: createVehicleRecord({ vehicle: { vin: 'xxx', techRecord: [{}] } as VehicleTechRecordModel }) });

        // mock service call
        const expectedError = new HttpErrorResponse({ status: 500, statusText: 'Internal server error' });

        jest.spyOn(techRecordHttpService, 'createVehicleRecord').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.createVehicleRecord$).toBe('---b', {
          b: createVehicleRecordFailure({ error: 'Unable to create vehicle with VIN xxx' })
        });
      });
    });
  });

  describe('createProvisionalTechRecord', () => {
    it('should return a technical record on successful API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const technicalRecord = mockVehicleTechnicalRecordList();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: createProvisionalTechRecord });

        // mock service call
        jest.spyOn(techRecordHttpService, 'createProvisionalTechRecord').mockReturnValue(cold('--a|', { a: technicalRecord[0] }));

        // expect effect to return success action
        expectObservable(effects.createProvisionalTechRecord$).toBe('---b', {
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
        jest.spyOn(techRecordHttpService, 'createProvisionalTechRecord').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.createProvisionalTechRecord$).toBe('---b', {
          b: createProvisionalTechRecordFailure({
            error: 'Unable to create a new provisional record null'
          })
        });
      });
    });
  });

  describe('updateTechRecords$', () => {
    it('should return a technical record on successful API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const technicalRecord = mockVehicleTechnicalRecordList();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: updateTechRecords });

        // mock service call
        jest.spyOn(techRecordHttpService, 'updateTechRecords').mockReturnValue(cold('--a|', { a: technicalRecord[0] }));

        // expect effect to return success action
        expectObservable(effects.updateTechRecords$).toBe('---b', {
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
        jest.spyOn(techRecordHttpService, 'updateTechRecords').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.updateTechRecords$).toBe('---b', {
          b: updateTechRecordsFailure({
            error: 'Unable to update technical record null'
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
        jest.spyOn(techRecordHttpService, 'createProvisionalTechRecord').mockReturnValue(cold('--a|', { a: technicalRecord[0] }));

        // expect effect to return success action
        expectObservable(effects.createProvisionalTechRecord$).toBe('---b', {
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
        jest.spyOn(techRecordHttpService, 'createProvisionalTechRecord').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.createProvisionalTechRecord$).toBe('---b', {
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
        const expectedTechRecord = getEmptyTechRecord();

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

function getEmptyTechRecord(): TechRecordModel {
  return {
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
}
