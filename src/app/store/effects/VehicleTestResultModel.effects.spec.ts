import {Observable, of, ReplaySubject} from 'rxjs';
import {TechnicalRecordServiceMock} from '../../../../testconfig/services-mocks/technical-record-service.mock';
import {TestBed} from '@angular/core/testing';
import {TechnicalRecordService} from '@app/technical-record-search/technical-record.service';
import {RouterTestingModule} from '@angular/router/testing';
import {INITIAL_STATE, Store} from '@ngrx/store';
import {hot} from 'jasmine-marbles';
import {provideMockActions} from '@ngrx/effects/testing';
import {EVehicleTestResultModelActions,
        GetVehicleTestResultModel,
        GetVehicleTestResultModelFailure,
        GetVehicleTestResultModelSuccess} from '@app/store/actions/VehicleTestResultModel.actions';
import {IAppState} from '@app/store/state/app.state';
import {VehicleTestResultModelEffects} from '@app/store/effects/VehicleTestResultModel.effects';
import {TestResultService} from '@app/technical-record-search/test-result.service';
import {TestResultModel} from '@app/models/test-result.model';

const testResult: TestResultModel = {
  testerStaffId: '1234',
  testStartTimestamp: new Date('2019-01-14T10:36:33.987Z'),
  odometerReadingUnits: 'string',
  testEndTimestamp: new Date('2019-01-14T10:36:33.987Z'),
  testStatus: 'string',
  testTypes: [],
  vehicleClass: null,
  vin: '1234',
  vehicleSize: 'string',
  testStationName: 'string',
  vehicleId: '3121',
  noOfAxles: 2,
  vehicleType: 'string',
  countryOfRegistration: 'string',
  preparerId: '2332',
  preparerName: 'string',
  odometerReading: 232,
  vehicleConfiguration: 'string',
  testStationType: 'string',
  reasonForCancellation: 'string',
  testerName: 'Dorel',
  vrm: '234234',
  testStationPNumber: 'string',
  numberOfSeats: 32,
  testerEmailAddress: 'string',
  euVehicleCategory: 'string'
};

describe('VehicleTechRecordModelEffects', () => {
  let actions: Observable<any>;
  let effects: VehicleTestResultModelEffects;
  let technicalRecordService: TestResultService;
  let store: Store<IAppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        VehicleTestResultModelEffects,
        provideMockActions(() => actions),
        {provide: TestResultService, useValue: TechnicalRecordServiceMock},
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

    effects = TestBed.get(VehicleTestResultModelEffects);
    technicalRecordService = TestBed.get(TestResultService);
    store = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it(' getTestResults$ should return an GetVehicleTestResultModelSuccess action', () => {
    const action = new ReplaySubject(1);
    action.next(new GetVehicleTestResultModel('1234'));
    const eff = effects.getTestResults$;
    const sucess = new GetVehicleTestResultModelSuccess(testResult);
    eff.subscribe((result) => {
      expect(result).toEqual(sucess);
    });
  });


});
