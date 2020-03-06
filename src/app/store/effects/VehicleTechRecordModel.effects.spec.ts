import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { VehicleTechRecordModelEffects } from '@app/store/effects/VehicleTechRecordModel.effects';
import { TechnicalRecordServiceMock } from '../../../../testconfig/services-mocks/technical-record-service.mock';
import { TestBed } from '@angular/core/testing';
import { TechnicalRecordService } from '@app/technical-record-search/technical-record.service';
import { RouterTestingModule } from '@angular/router/testing';
import { INITIAL_STATE, Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  EVehicleTechRecordModelActions,
  GetVehicleTechRecordModel,
  GetVehicleTechRecordModelSuccess,
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess,
  GetVehicleTechRecordModelHavingStatusAllFailure,
  SetVehicleTechRecordModelVinOnCreate, SetVehicleTechRecordModelVinOnCreateSucess
} from '@app/store/actions/VehicleTechRecordModel.actions';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { addMatchers, initTestScheduler } from 'jasmine-marbles';
import { IAppState } from '@app/store/state/app.state';
import { VEHICLE_TECH_RECORD_SEARCH_ERRORS } from '@app/app.enums';

const techRecordModel: VehicleTechRecordModel = {
  vrms: null,
  vin: 'ABCDEFGH777777',
  techRecord: [],
  metadata: { adrDetails: undefined },
  error: null,
};

describe('VehicleTechRecordModelEffects', () => {
  let actions: Observable<any>;
  let effects: VehicleTechRecordModelEffects;
  let technicalRecordService: TechnicalRecordService;
  let store: Store<IAppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        VehicleTechRecordModelEffects,
        provideMockActions(() => actions),
        { provide: TechnicalRecordService, useValue: TechnicalRecordServiceMock },
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        }
      ]
    });

    effects = TestBed.get(VehicleTechRecordModelEffects);
    technicalRecordService = TestBed.get(TechnicalRecordService);
    addMatchers();
    store = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });


  it(' getTechnicalRecords$ - should call the technicalRecordService service method info with a payload', () => {
    actions = cold('a', { a: new GetVehicleTechRecordModelHavingStatusAll('ABCDEFGH777777') });
    effects.getTechnicalRecords$.subscribe(() => {
      try {
        expect(technicalRecordService.getTechnicalRecordsAllStatuses).toHaveBeenCalledWith('ABCDEFGH777777');
      } catch (error) {
        fail('setVinOnCreate$: ' + error);
      }
    });
  });


  it('should return an GetVehicleTechRecordModelHavingStatusAllSucess action', () => {
    const action = new ReplaySubject(1);
    action.next(new GetVehicleTechRecordModelHavingStatusAll('1234'));

    effects.getTechnicalRecords$.subscribe(result => {
      expect(result).toEqual(new GetVehicleTechRecordModelHavingStatusAllSuccess(techRecordModel));
    });
  });

  it('setVinOnCreate$ - should call the technicalRecordService service method info with a payload', () => {
    const valuePayload = { vin: 'aaa', vrm: 'bbb', vType: 'PSV', error: [] };
    const requestErrors = [];
    const requests: Observable<any>[] = [of(undefined), of(undefined)];

    actions = cold('a', { a: new SetVehicleTechRecordModelVinOnCreate(valuePayload) });

    forkJoin(requests).subscribe((result) => {
      try {
        expect(result[0]).toBe(undefined);
        expect(result[1]).toBe(undefined);
      } catch (error) {
        fail('forkJoin: ' + error);
      }
    });

    effects.setVinOnCreate$.subscribe(() => {
      try {
        spyOn(store, 'dispatch');
        expect(technicalRecordService.getTechnicalRecordsAllStatuses).toHaveBeenCalledWith(valuePayload.vin);
        expect(technicalRecordService.getTechnicalRecordsAllStatuses).toHaveBeenCalledWith(valuePayload.vrm);
        expect(requestErrors).toEqual([]);
        expect(store.dispatch).toHaveBeenCalledWith(new SetVehicleTechRecordModelVinOnCreateSucess({
          vin: 'aaa',
          vrm: 'bbb',
          vType: 'PSV',
          error: requestErrors
        }));
      } catch (error) {
        fail('setVinOnCreate$: ' + error);
      }
    });
  });

  it('setVinOnCreate$ - should return errors for existing VIN & VRM', () => {
    const valuePayload = { vin: 'P012301230001', vrm: 'CT70002', vType: 'HGV', error: [] };

    effects.setVinOnCreate$.subscribe(() => {
      spyOn(store, 'dispatch');
      expect(technicalRecordService.getTechnicalRecordsAllStatuses).toHaveBeenCalledWith(valuePayload.vin);
      expect(technicalRecordService.getTechnicalRecordsAllStatuses).toHaveBeenCalledWith(valuePayload.vrm);
      expect(store.dispatch).toHaveBeenCalledWith(new SetVehicleTechRecordModelVinOnCreateSucess(valuePayload));
    });

  });

  it('setVinOnCreate$ - should return errors for existing VIN & VRM', () => {
    const valuePayload = { vin: 'P012301230001', vrm: 'CT70002', vType: 'Trailer', error: [] };

    effects.setVinOnCreate$.subscribe(() => {
      spyOn(store, 'dispatch');
      expect(technicalRecordService.getTechnicalRecordsAllStatuses).toHaveBeenCalledWith('P012301230001');
      expect(store.dispatch).toHaveBeenCalledWith(new SetVehicleTechRecordModelVinOnCreateSucess(valuePayload));
    });

  });

  describe('getSearchResultError', () => {
    test('should return not found error', () => {
      expect(effects.getSearchResultError({ error: 'No resources match the search criteria.' }))
        .toBe(VEHICLE_TECH_RECORD_SEARCH_ERRORS.NOT_FOUND);
    });

    test('should return multiple found error', () => {
      expect(effects.getSearchResultError({ error: 'The provided partial VIN returned more than one match.' }))
        .toBe(VEHICLE_TECH_RECORD_SEARCH_ERRORS.MULTIPLE_FOUND);
    });

    test('should return no input from the user', () => {
      expect(effects.getSearchResultError({ error: { error: 'test' } }))
        .toBe(VEHICLE_TECH_RECORD_SEARCH_ERRORS.NO_INPUT);
    });

    test('should return error from backend when no case is applicable', () =>{
      expect(effects.getSearchResultError({error: 'Random issue'})).toBe('Random issue');
    });
  });

});
