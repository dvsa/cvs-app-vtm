import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiModule as TestResultsApiModule } from '@api/test-results';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestType } from '@models/test-types/test-type.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState, State } from '@store/.';
import { selectQueryParams, selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { createMock, createMockList } from 'ts-auto-mock';
import { mockTestResult, mockTestResultList } from '../../../../mocks/mock-test-result';
import { masterTpl } from '../../../forms/templates/test-records/master.template';
import {
  editingTestResult,
  fetchSelectedTestResult,
  fetchSelectedTestResultFailed,
  fetchSelectedTestResultSuccess,
  fetchTestResultsBySystemNumber,
  fetchTestResultsBySystemNumberFailed,
  fetchTestResultsBySystemNumberSuccess,
  templateSectionsChanged,
  updateEditingTestResult,
  updateTestResult,
  updateTestResultFailed,
  updateTestResultSuccess
} from '../actions/test-records.actions';
import { selectedTestResultState } from '../selectors/test-records.selectors';
import { TestResultsEffects } from './test-records.effects';

jest.mock('../../../forms/templates/test-records/master.template', () => ({
  __esModule: true,
  default: jest.fn(),
  masterTpl: {
    psv: {
      default: {
        test: <FormNode>{
          name: 'Default',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'testTypes',
              type: FormNodeTypes.ARRAY,
              children: [{ name: '0', type: FormNodeTypes.GROUP, children: [{ name: 'testTypeId', type: FormNodeTypes.CONTROL, value: '' }] }]
            }
          ]
        }
      },
      testTypesGroup1: {
        test: <FormNode>{
          name: 'Test',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'testTypes',
              type: FormNodeTypes.ARRAY,
              children: [{ name: '0', type: FormNodeTypes.GROUP, children: [{ name: 'testTypeId', type: FormNodeTypes.CONTROL, value: '' }] }]
            }
          ]
        }
      }
    }
  }
}));

describe('TestResultsEffects', () => {
  let effects: TestResultsEffects;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let testResultsService: TestRecordsService;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TestResultsApiModule],
      providers: [
        TestResultsEffects,
        provideMockActions(() => actions$),
        TestRecordsService,
        provideMockStore({
          initialState: initialAppState,
          selectors: [
            {
              selector: selectRouteNestedParams,
              value: [
                {
                  systemNumber: 'systemNumber01',
                  testResultId: 'testResult01'
                }
              ]
            }
          ]
        }),
        { provide: UserService, useValue: { userName$: of('username'), id$: of('iod') } },
        RouterService,
        DynamicFormService
      ]
    });

    store = TestBed.inject(MockStore);
    effects = TestBed.inject(TestResultsEffects);
    testResultsService = TestBed.inject(TestRecordsService);
  });

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('fetchTestResultsBySystemNumber$', () => {
    it('should return fetchTestResultBySystemNumberSuccess action on successfull API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const testResults = mockTestResultList();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: fetchTestResultsBySystemNumber });

        // mock service call
        jest.spyOn(testResultsService, 'fetchTestResultbySystemNumber').mockReturnValue(cold('--a|', { a: testResults }));

        // expect effect to return success action
        expectObservable(effects.fetchTestResultsBySystemNumber$).toBe('---b', {
          b: fetchTestResultsBySystemNumberSuccess({ payload: testResults })
        });
      });
    });

    it('should return fetchTestResultsBySystemNumberFailed action on API error', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a--', { a: fetchTestResultsBySystemNumber });

        const expectedError = new HttpErrorResponse({
          status: 500,
          statusText: 'Internal server error'
        });
        jest.spyOn(testResultsService, 'fetchTestResultbySystemNumber').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchTestResultsBySystemNumber$).toBe('---b', {
          b: fetchTestResultsBySystemNumberFailed({ error: 'Http failure response for (unknown url): 500 Internal server error' })
        });
      });
    });

    it('should return fetchTestResultsBySystemNumberFailed action on API error', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a--', { a: fetchTestResultsBySystemNumber });

        const expectedError = new HttpErrorResponse({
          status: 500,
          statusText: 'server not available'
        });
        jest.spyOn(testResultsService, 'fetchTestResultbySystemNumber').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchTestResultsBySystemNumber$).toBe('---b', {
          b: fetchTestResultsBySystemNumberFailed({ error: 'Http failure response for (unknown url): 500 server not available' })
        });
      });
    });

    it('should return fetchTestResultsBySystemNumberSuccess on a 404', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a--', { a: fetchTestResultsBySystemNumber });

        const expectedError = new HttpErrorResponse({
          status: 404,
          statusText: 'Not found'
        });
        jest.spyOn(testResultsService, 'fetchTestResultbySystemNumber').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchTestResultsBySystemNumber$).toBe('---b', {
          b: fetchTestResultsBySystemNumberSuccess({ payload: [] as TestResultModel[] })
        });
      });
    });
  });

  describe('fetchSelectedTestResult$', () => {
    it('should return fetchSelectedTestResultSuccess', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const testResult = mockTestResult();

        actions$ = hot('-a-', { a: fetchSelectedTestResult() });

        jest.spyOn(testResultsService, 'fetchTestResultbySystemNumber').mockReturnValue(cold('--a|', { a: [testResult] }));

        expectObservable(effects.fetchSelectedTestResult$).toBe('---b', {
          b: fetchSelectedTestResultSuccess({ payload: testResult })
        });
      });
    });

    it('should return fetchSelectedTestResultFailed if API returns empty array', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a-', { a: fetchSelectedTestResult() });

        jest.spyOn(testResultsService, 'fetchTestResultbySystemNumber').mockReturnValue(cold('--a|', { a: [] }));

        expectObservable(effects.fetchSelectedTestResult$).toBe('---b', {
          b: fetchSelectedTestResultFailed({ error: 'Test result not found' })
        });
      });
    });

    it('should return fetchSelectedTestResultFailed if API returns an error', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a-', { a: fetchSelectedTestResult() });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 400,
          statusText: 'Bad Request'
        });
        jest.spyOn(testResultsService, 'fetchTestResultbySystemNumber').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchSelectedTestResult$).toBe('---b', {
          b: fetchSelectedTestResultFailed({ error: 'Http failure response for (unknown url): 400 Bad Request' })
        });
      });
    });
  });

  describe('updateTestResult$', () => {
    const newTestResult = { testResultId: '1' } as TestResultModel;

    it('should dispatch updateTestResultSuccess with return payload', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a-', { a: updateTestResult({ value: newTestResult }) });

        jest.spyOn(testResultsService, 'saveTestResult').mockReturnValue(cold('---b', { b: newTestResult }));

        expectObservable(effects.updateTestResult$).toBe('----b', {
          b: updateTestResultSuccess({ payload: { id: '1', changes: newTestResult } })
        });
      });
    });

    it('should dispatch updateTestResultFailed action with empty errors array', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a-', { a: updateTestResult({ value: newTestResult }) });

        jest
          .spyOn(testResultsService, 'saveTestResult')
          .mockReturnValue(cold('---#|', {}, new HttpErrorResponse({ status: 500, error: 'some error' })));

        expectObservable(effects.updateTestResult$).toBe('----b', {
          b: updateTestResultFailed({ errors: [] })
        });
      });
    });

    it('should dispatch updateTestResultFailed action with validation errors', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a-', { a: updateTestResult({ value: newTestResult }) });

        jest
          .spyOn(testResultsService, 'saveTestResult')
          .mockReturnValue(
            cold('---#|', {}, new HttpErrorResponse({ status: 400, error: { errors: ['"name" is missing', '"age" is missing', 'random error'] } }))
          );

        const expectedErrors: GlobalError[] = [
          { error: '"name" is missing', anchorLink: 'name' },
          { error: '"age" is missing', anchorLink: 'age' },
          { error: 'random error', anchorLink: '' }
        ];
        expectObservable(effects.updateTestResult$).toBe('----b', {
          b: updateTestResultFailed({ errors: expectedErrors })
        });
      });
    });
  });

  describe('generateSectionTemplatesAndtestResultToUpdate$', () => {
    beforeEach(() => {
      store.resetSelectors();
      jest.resetModules();
    });

    it('should dispatch templateSectionsChanged with new sections and test result', () => {
      // const { masterTpl } = require('../../../forms/templates/test-records/master.template');
      const testResult = createMock<TestResultModel>({
        vehicleType: VehicleTypes.PSV,
        testTypes: createMockList<TestType>(1, i => createMock<TestType>({ testTypeId: '1' }))
      });

      testScheduler.run(({ hot, expectObservable }) => {
        store.overrideSelector(selectedTestResultState, testResult);

        actions$ = hot('-a', {
          a: editingTestResult({
            testResult
          })
        });

        expectObservable(effects.generateSectionTemplatesAndtestResultToUpdate$).toBe('-b', {
          b: templateSectionsChanged({
            sectionTemplates: Object.values(masterTpl.psv['testTypesGroup1']),
            sectionsValue: { testTypes: [{ testTypeId: '1' }] } as unknown as TestResultModel
          })
        });
      });
    });

    it('should return empty section templates if action testResult.vehicleType === undefined', () => {
      const testResult = createMock<TestResultModel>({
        vehicleType: undefined,
        testTypes: createMockList<TestType>(1, i => createMock<TestType>({ testTypeId: '1' }))
      });

      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a', {
          a: updateEditingTestResult({
            testResult
          })
        });

        expectObservable(effects.generateSectionTemplatesAndtestResultToUpdate$).toBe('-b', {
          b: templateSectionsChanged({
            sectionTemplates: [],
            sectionsValue: undefined
          })
        });
      });
    });

    it('should return empty section templates if action testResult.vehicleType is not known by masterTpl', () => {
      const testResult = createMock<TestResultModel>({
        vehicleType: 'car' as VehicleTypes,
        testTypes: createMockList<TestType>(1, i => createMock<TestType>({ testTypeId: '1' }))
      });

      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a', {
          a: updateEditingTestResult({
            testResult
          })
        });

        expectObservable(effects.generateSectionTemplatesAndtestResultToUpdate$).toBe('-b', {
          b: templateSectionsChanged({
            sectionTemplates: [],
            sectionsValue: undefined
          })
        });
      });
    });

    it('should return empty section templates if testTypeId doesnt apply to vehicleType', () => {
      const testResult = createMock<TestResultModel>({
        vehicleType: VehicleTypes.PSV,
        testTypes: createMockList<TestType>(1, i => createMock<TestType>({ testTypeId: '190' }))
      });

      testScheduler.run(({ hot, expectObservable }) => {
        store.overrideSelector(selectQueryParams, { edit: 'true' });

        actions$ = hot('-a', {
          a: updateEditingTestResult({
            testResult
          })
        });

        expectObservable(effects.generateSectionTemplatesAndtestResultToUpdate$).toBe('-b', {
          b: templateSectionsChanged({
            sectionTemplates: [],
            sectionsValue: undefined
          })
        });
      });
    });

    it('should return empty section templates if testTypeId is known but not in master template and edit is true', () => {
      const testResult = createMock<TestResultModel>({
        vehicleType: VehicleTypes.PSV,
        testTypes: createMockList<TestType>(1, i => createMock<TestType>({ testTypeId: '39' }))
      });

      testScheduler.run(({ hot, expectObservable }) => {
        store.overrideSelector(selectQueryParams, { edit: 'true' });

        actions$ = hot('-a', {
          a: updateEditingTestResult({
            testResult
          })
        });

        expectObservable(effects.generateSectionTemplatesAndtestResultToUpdate$).toBe('-b', {
          b: templateSectionsChanged({
            sectionTemplates: [],
            sectionsValue: undefined
          })
        });
      });
    });

    it('should return default section templates if testTypeId is known but not in master template and edit is false', () => {
      const testResult = createMock<TestResultModel>({
        vehicleType: VehicleTypes.PSV,
        testTypes: createMockList<TestType>(1, i => createMock<TestType>({ testTypeId: '39' }))
      });

      testScheduler.run(({ hot, expectObservable }) => {
        store.overrideSelector(selectQueryParams, { edit: 'false' });

        actions$ = hot('-a', {
          a: updateEditingTestResult({
            testResult
          })
        });

        expectObservable(effects.generateSectionTemplatesAndtestResultToUpdate$).toBe('-b', {
          b: templateSectionsChanged({
            sectionTemplates: Object.values(masterTpl.psv['default']),
            sectionsValue: { testTypes: [{ testTypeId: '39' }] } as unknown as TestResultModel
          })
        });
      });
    });

    it('should not dispatch any actions when updateEditingTestResult is caught without testTypeId', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a', {
          a: updateEditingTestResult({
            testResult: {} as TestResultModel
          })
        });

        expectObservable(effects.generateSectionTemplatesAndtestResultToUpdate$).toBe('--', {
          b: []
        });
      });
    });
  });
});
