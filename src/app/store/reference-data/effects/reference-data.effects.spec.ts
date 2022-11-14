import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReferenceDataItem } from '@api/reference-data';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { initialAppState, State } from '@store/.';
import { testResultInEdit } from '@store/test-records';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
  fetchReasonsForAbandoning,
  fetchReferenceData,
  fetchReferenceDataByKey,
  fetchReferenceDataByKeyFailed,
  fetchReferenceDataByKeySuccess,
  fetchReferenceDataFailed,
  fetchReferenceDataSuccess
} from '../actions/reference-data.actions';
import { testCases } from '../reference-data.test-cases';
import { ReferenceDataEffects } from './reference-data.effects';

describe('ReferenceDataEffects', () => {
  let effects: ReferenceDataEffects;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let referenceDataService: ReferenceDataService;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReferenceDataEffects,
        provideMockActions(() => actions$),
        ReferenceDataService,
        provideMockStore({
          initialState: initialAppState
        })
      ]
    });

    effects = TestBed.inject(ReferenceDataEffects);
    store = TestBed.inject(MockStore);
    referenceDataService = TestBed.inject(ReferenceDataService);
  });

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('fetchReferenceDataByType$', () => {
    it.each(testCases)('should return fetchReferenceDataSuccess action on successfull API call', value => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const { resourceType, payload } = value;
        const apiResponse = { data: [...payload] };

        // mock action to trigger effect
        actions$ = hot('-a--', { a: fetchReferenceData({ resourceType }) });

        // mock service call
        jest.spyOn(referenceDataService, 'fetchReferenceData').mockReturnValue(cold('--a|', { a: apiResponse }));

        // expect effect to return success action
        expectObservable(effects.fetchReferenceDataByType$).toBe('---b', {
          b: fetchReferenceDataSuccess({ resourceType, payload, paginated: false })
        });
      });
    });

    it.each(testCases)(
      'should return fetchReferenceDataSuccess and fetchReferenceData actions on successfull API call with pagination token',
      value => {
        testScheduler.run(({ hot, cold, expectObservable }) => {
          const { resourceType, payload } = value;
          const apiResponse = { data: [...payload], paginationToken: 'token' };

          // mock action to trigger effect
          actions$ = hot('-a--', { a: fetchReferenceData({ resourceType }) });

          // mock service call
          jest.spyOn(referenceDataService, 'fetchReferenceData').mockReturnValue(cold('--a|', { a: apiResponse }));

          // expect effect to return success action
          expectObservable(effects.fetchReferenceDataByType$).toBe('---(bc)', {
            b: fetchReferenceDataSuccess({ resourceType, payload, paginated: true }),
            c: fetchReferenceData({ resourceType, paginationToken: 'token' })
          });
        });
      }
    );

    it.each(testCases)('should return fetchReferenceDataFailed action on API error', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a--', { a: fetchReferenceData({ resourceType: null as any }) });

        const expectedError = new Error('Reference data resourceType is required');

        jest.spyOn(referenceDataService, 'fetchReferenceData').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchReferenceDataByType$).toBe('---b', {
          b: fetchReferenceDataFailed({ error: 'Reference data resourceType is required', resourceType: null as any })
        });
      });
    });
  });

  describe('fetchReferenceDataByKey$', () => {
    it.each(testCases)('should return fetchReferenceDataByKeySuccess action on successful API call', value => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const { resourceType, resourceKey, payload } = value;
        const entity: ReferenceDataItem = payload.find(p => p.resourceKey === resourceKey)!;

        // mock action to trigger effect
        actions$ = hot('-a--', { a: fetchReferenceDataByKey({ resourceType, resourceKey }) });

        // mock service call
        jest.spyOn(referenceDataService, 'fetchReferenceDataByKey').mockReturnValue(cold('--a|', { a: entity }));

        // expect effect to return success action
        expectObservable(effects.fetchReferenceDataByKey$).toBe('---b', {
          b: fetchReferenceDataByKeySuccess({ resourceType, resourceKey, payload: entity as ReferenceDataModelBase })
        });
      });
    });

    it.each(testCases)('should return fetchReferenceDataByKeyFailed action on API error', value => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const { resourceType } = value;
        actions$ = hot('-a--', { a: fetchReferenceDataByKey({ resourceType, resourceKey: null as any }) });

        const expectedError = new Error('Reference data resourceKey is required');

        jest.spyOn(referenceDataService, 'fetchReferenceDataByKey').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchReferenceDataByKey$).toBe('---b', {
          b: fetchReferenceDataByKeyFailed({ error: 'Reference data resourceKey is required', resourceType: resourceType })
        });
      });
    });
  });

  const vehicleTypeReasonsForAbandoning = [
    {
      vehicleType: VehicleTypes.PSV,
      resourceType: ReferenceDataResourceType.ReasonsForAbandoningPsv
    },
    {
      vehicleType: VehicleTypes.TRL,
      resourceType: ReferenceDataResourceType.ReasonsForAbandoningTrl
    },
    {
      vehicleType: VehicleTypes.HGV,
      resourceType: ReferenceDataResourceType.ReasonsForAbandoningHgv
    }
  ];
  it.each(vehicleTypeReasonsForAbandoning)('should dispatch the action to fetch the reasons for abandoning for the right vehicle', values => {
    const { vehicleType, resourceType } = values;
    const testResult = { vehicleType } as TestResultModel;

    testScheduler.run(({ hot, expectObservable }) => {
      store.overrideSelector(testResultInEdit, testResult);

      actions$ = hot('-a', {
        a: fetchReasonsForAbandoning()
      });

      expectObservable(effects.fetchReasonsForAbandoning).toBe('-b', {
        b: fetchReferenceData({
          resourceType
        })
      });
    });
  });
});
