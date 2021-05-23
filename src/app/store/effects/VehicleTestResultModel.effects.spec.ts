import { BehaviorSubject, Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import {
  GetVehicleTestResultModel,
  GetVehicleTestResultModelSuccess,
  SetTestViewState,
  UpdateSelectedTestResultModel,
  UpdateSelectedTestResultModelSuccess,
  UpdateTestResult,
  UpdateTestResultSuccess
} from '@app/store/actions/VehicleTestResultModel.actions';
import { VehicleTestResultModelEffects } from '@app/store/effects/VehicleTestResultModel.effects';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestResultTestTypeNumber } from '@app/models/test-result-test-type-number';
import { VIEW_STATE } from '@app/app.enums';
import { ClearErrorMessage } from '@app/store/actions/Error.actions';
import { UserService } from '@app/app-user.service';
import { UserDetails } from '@app/models/user-details';
import { MockStore } from '@app/utils/mockStore';
import { DownloadCertificate } from '../actions/VehicleTestResultModel.actions';
import * as FileSaver from 'file-saver';
import { TEST_MODEL_UTILS } from '@app/utils/test-model.utils';
import { Router } from '@angular/router';
import { TestType } from '@app/models/test.type';
import { KeyValue } from '@angular/common';
import { VehicleTestResultUpdate } from '@app/models/vehicle-test-result-update';

const testResult = [TEST_MODEL_UTILS.mockTestRecord()];

describe('VehicleTestResultModelEffects', () => {
  let effects: VehicleTestResultModelEffects;
  let testResultService: TestResultService;
  const mockSelector = new BehaviorSubject<any>(undefined);
  const store: MockStore = new MockStore(mockSelector);

  let actions$: Observable<Action>;
  let action: Action;
  let updateTestResults: jest.Mock;
  let getTestResults: jest.Mock;
  let getUser: jest.Mock;
  let downloadCertificate: jest.Mock;
  let navigate: jest.Mock;
  let getRouterParams: jest.Mock;

  beforeEach(() => {
    updateTestResults = jest.fn();
    getTestResults = jest.fn();
    getUser = jest.fn();
    downloadCertificate = jest.fn();
    navigate = jest.fn();
    getRouterParams = jest.fn();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        [VehicleTestResultModelEffects, provideMockActions(() => actions$)],
        {
          provide: TestResultService,
          useValue: { updateTestResults, getTestResults, downloadCertificate }
        },
        {
          provide: Store,
          useValue: store
        },
        {
          provide: UserService,
          useValue: { getUser }
        },
        {
          provide: Router,
          useValue: { navigate }
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

      const getTestResults$ = cold('(b|)', { b: [TEST_MODEL_UTILS.mockTestRecord()] });
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
      testResultUpdated: TEST_MODEL_UTILS.mockTestRecord(),
      testTypeNumber: '1',
      testResultsUpdated: [TEST_MODEL_UTILS.mockTestRecord()],
      msUserDetails: userDetails
    } as TestResultTestTypeNumber;

    beforeEach(() => {
      mockSelector.next({
        getVehicleTestResultModel: [TEST_MODEL_UTILS.mockTestRecord()]
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
      expect(updateTestResults).toHaveBeenCalledWith({
        msUserDetails: userDetails,
        testResult: testResultTestTypeNumber.testResultsUpdated[0]
      } as VehicleTestResultUpdate);
    });
  });

  describe('downloadCertificate', () => {
    const fileName = 'file_name.pdf';
    beforeEach(() => {
      action = new DownloadCertificate(fileName);
      actions$ = hot('-a--', { a: action });
    });
    it('should download certificate', () => {
      const arrayBuff = new ArrayBuffer(100);
      const downloadedDoc = new Blob([arrayBuff]);
      spyOn(FileSaver, 'saveAs').and.stub();

      const downloadedCert$ = cold('-(b|)-', {
        b: arrayBuff
      });

      const expected$ = cold('--(c)-', {
        c: undefined
      });

      downloadCertificate.mockReturnValue(downloadedCert$);

      expect(effects.downloadCertificate$).toBeObservable(expected$);
      expect(downloadCertificate).toHaveBeenCalledWith(fileName);
      // tslint:disable-next-line: deprecation
      expect(FileSaver.saveAs).toHaveBeenCalledWith(downloadedDoc, fileName, { autoBom: false });
    });

    it('should dispatch SetErrorMessage Action', () => {
      const error = new Error('some error');
      const errorMsg = ['error'];

      const failed$ = cold('-#', {}, error);
      const expected$ = cold('--e-', {
        e: undefined
      });

      downloadCertificate.mockReturnValue(failed$);

      expect(effects.downloadCertificate$).toBeObservable(expected$);
    });
  });

  describe('updateSelectedTestResult$', () => {
    const testTreeNode = {
      key: '1',
      value: 'test'
    } as KeyValue<string, string>;

    beforeEach(() => {
      mockSelector.next({
        getSelectedVehicleTestResultModel: TEST_MODEL_UTILS.mockTestRecord(),
        getRouterParams: { params: { id: '12345' } }
      });
      action = new UpdateSelectedTestResultModel(testTreeNode);
      actions$ = hot('-a--', { a: action });
    });

    it('should return updated selected test result', () => {
      const testType = TEST_MODEL_UTILS.mockTestType({ testTypeName: 'first test' } as TestType);
      const updateSuccessAction = new UpdateSelectedTestResultModelSuccess(
        TEST_MODEL_UTILS.mockTestRecord({
          testTypes: [testType]
        })
      );

      const expected$ = cold('-(b)-', { b: updateSuccessAction });
      expect(effects.updateSelectedTestResult$).toBeObservable(expected$);
      expect(navigate).toHaveBeenCalledWith(['/test-record', '12345'], {
        queryParams: { systemNumber: '123', testResultId: '123' }
      });
    });
  });
});
