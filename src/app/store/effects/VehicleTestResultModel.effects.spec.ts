import { BehaviorSubject, Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import {
  GetVehicleTestResultModel,
  GetVehicleTestResultModelSuccess,
  SetTestViewState,
  UpdateTestResult,
  UpdateTestResultSuccess
} from '@app/store/actions/VehicleTestResultModel.actions';
import { VehicleTestResultModelEffects } from '@app/store/effects/VehicleTestResultModel.effects';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestResultTestTypeNumber } from '@app/models/test-result-test-type-number';
import { TESTING_TEST_MODELS_UTILS } from '@app/utils/testing-test-models.utils';
import { VIEW_STATE } from '@app/app.enums';
import { ClearErrorMessage } from '@app/store/actions/Error.actions';
import { UserService } from '@app/app-user.service';
import { UserDetails } from '@app/models/user-details';
import { MockStore } from '@app/utils/mockStore';

const testResult = [TESTING_TEST_MODELS_UTILS.mockTestRecord()];
const mockSelector = new BehaviorSubject<any>(undefined);

describe('VehicleTestResultModelEffects', () => {
  let effects: VehicleTestResultModelEffects;
  let testResultService: TestResultService;
  const store: MockStore = new MockStore(mockSelector, '44');

  let actions$: Observable<Action>;
  let action: Action;
  let updateTestResults: jest.Mock;
  let getTestResults: jest.Mock;
  let getUser: jest.Mock;

  beforeEach(() => {
    updateTestResults = jest.fn();
    getTestResults = jest.fn();
    getUser = jest.fn();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        [VehicleTestResultModelEffects, provideMockActions(() => actions$)],
        {
          provide: TestResultService,
          useValue: { updateTestResults, getTestResults }
        },
        {
          provide: Store,
          useValue: store
        },
        {
          provide: UserService,
          useValue: { getUser }
        }
      ]
    });

    effects = TestBed.get(VehicleTestResultModelEffects);
    testResultService = TestBed.get(TestResultService);
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('getTestResults$', () => {

    it('should return test results observable', () => {
      action = new GetVehicleTestResultModel('123');
      actions$ = hot('-a--', { a: action });

      const getTestResults$ = cold('(b|)', { b: [TESTING_TEST_MODELS_UTILS.mockTestRecord()] });
      getTestResults.mockReturnValue(getTestResults$);

      const testResultSuccessAction = new GetVehicleTestResultModelSuccess(testResult);
      const expected$ = cold('-(b)-', { b: testResultSuccessAction });

      expect(effects.getTestResults$).toBeObservable(expected$);
      expect(store.dispatch).toHaveBeenCalledWith({ type: '[Error] Clear' });
    });
  });

  describe('updateTestResult$', () => {
    const userDetails = {
      msOid: 'test-oid',
      msUser: 'test'
    } as UserDetails;

    const testResultTestTypeNumber = {
      testResultUpdated: TESTING_TEST_MODELS_UTILS.mockTestRecord(),
      testTypeNumber: '1',
      testResultsUpdated: [TESTING_TEST_MODELS_UTILS.mockTestRecord()],
      msUserDetails: userDetails
    } as TestResultTestTypeNumber;

    beforeEach(() => {
      mockSelector.next({
        getVehicleTestResultModel: [TESTING_TEST_MODELS_UTILS.mockTestRecord()]
      });
      action = new UpdateTestResult(testResultTestTypeNumber);
      actions$ = hot('-a--', { a: action });
    });

    it('should return updated test result', () => {
      const updateSuccessAction = new UpdateTestResultSuccess(testResultTestTypeNumber);
      const setCurrentStateAction = new SetTestViewState(VIEW_STATE.VIEW_ONLY);
      const clearErrorMessageAction = new ClearErrorMessage();

      getUser.mockReturnValue(userDetails);

      const updateTestResult$ = cold('-(b|)', { b: testResultTestTypeNumber });
      updateTestResults.mockReturnValue(updateTestResult$);
      const expected$ = cold('--(cde)-', {
        c: setCurrentStateAction,
        d: updateSuccessAction,
        e: clearErrorMessageAction
      });

      expect(effects.updateTestResult$).toBeObservable(expected$);
      expect(updateTestResults).toHaveBeenCalledWith('123', {
        msUserDetails: userDetails,
        testResult: testResultTestTypeNumber.testResultsUpdated[0]
      });
    });
  });
});
