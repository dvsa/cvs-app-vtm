import {Observable, of, ReplaySubject} from 'rxjs';
import {VehicleTechRecordModelEffects} from '@app/store/effects/VehicleTechRecordModel.effects';
import {TechnicalRecordServiceMock} from '../../../../testconfig/services-mocks/technical-record-service.mock';
import {TestBed} from '@angular/core/testing';
import {TechnicalRecordService} from '@app/technical-record-search/technical-record.service';
import {RouterTestingModule} from '@angular/router/testing';
import {INITIAL_STATE, Store} from '@ngrx/store';
import {cold, hot} from 'jasmine-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  EVehicleTechRecordModelActions,
  GetVehicleTechRecordModel,
  GetVehicleTechRecordModelSuccess,
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess,
  GetVehicleTechRecordModelHavingStatusAllFailure,
  SetVehicleTechRecordModelVinOnCreate
} from '@app/store/actions/VehicleTechRecordModel.actions';
import {VehicleTechRecordModel} from '@app/models/vehicle-tech-record.model';
import { addMatchers, initTestScheduler } from 'jasmine-marbles';

const techRecordModel: VehicleTechRecordModel = {
  vrms: null,
  vin: '1234',
  techRecord: [],
  metadata: { adrDetails: undefined },
  error: null,
};

describe('VehicleTechRecordModelEffects', () => {
  let actions$: Observable<any>;
  let effects: VehicleTechRecordModelEffects;
  let technicalRecordService: TechnicalRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        VehicleTechRecordModelEffects,
        provideMockActions(() => actions$),
        { provide: TechnicalRecordService, useValue: TechnicalRecordServiceMock },
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', {a: INITIAL_STATE})),
            select: jest.fn()
          }
        }
      ]
    });

    effects = TestBed.get(VehicleTechRecordModelEffects);
    technicalRecordService = TestBed.get(TechnicalRecordService);
    addMatchers();

  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  // describe('getTechnicalRecords$', () => {
  //   it('should return an GetVehicleTechRecordModelHavingStatusAll action', () => {
  //
  //     const action = new GetVehicleTechRecordModelHavingStatusAll('1234');
  //     const outcome = new GetVehicleTechRecordModelHavingStatusAllSuccess(techRecordModel);
  //
  //     actions$ = hot('-a', {a: action});
  //     const expected = cold('--b', {b: outcome});
  //
  //     expect(effects.getTechnicalRecords$).toBeObservable(expected);
  //   });
  // });

  it('should return an GetVehicleTechRecordModelHavingStatusAllSucess action', () => {
    const actions = new ReplaySubject(1);
    actions.next(new GetVehicleTechRecordModelHavingStatusAll('1234'));

    effects.getTechnicalRecords$.subscribe(result => {
      expect(result).toEqual(new GetVehicleTechRecordModelHavingStatusAllSuccess(techRecordModel));
    });
  });


});
