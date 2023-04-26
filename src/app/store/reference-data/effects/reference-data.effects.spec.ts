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
  fetchReferenceDataByKeySearch,
  fetchReferenceDataByKeySearchFailed,
  fetchReferenceDataByKeySearchSuccess,
  fetchReferenceDataByKeySuccess,
  fetchReferenceDataFailed,
  fetchReferenceDataSuccess,
  fetchTyreReferenceDataByKeySearch,
  fetchTyreReferenceDataByKeySearchFailed,
  fetchTyreReferenceDataByKeySearchSuccess
} from '../actions/reference-data.actions';
import { testCases } from '../reference-data.test-cases';
import { ReferenceDataEffects } from './reference-data.effects';
import { UserService } from '@services/user-service/user-service';

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
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialAppState }),
        ReferenceDataEffects,
        ReferenceDataService,
        { provide: UserService, useValue: {} }
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

    it('should return fetchReferenceDataFailed action on API error', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a--', { a: fetchReferenceData({ resourceType: null as any }) });

        const expectedError = new Error('Reference data resourceType is required');

        jest.spyOn(referenceDataService, 'fetchReferenceData').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchReferenceDataByType$).toBe('---b', {
          b: fetchReferenceDataFailed({ error: 'Reference data resourceType is required', resourceType: null as any })
        });
      });
    });

    it('should return fetchReferenceDataFailed action when data is not found', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a--', { a: fetchReferenceData({ resourceType: ReferenceDataResourceType.HgvMake }) });

        jest.spyOn(referenceDataService, 'fetchReferenceData').mockReturnValue(cold('--a|', { a: { data: [] } }));

        expectObservable(effects.fetchReferenceDataByType$).toBe('---b', {
          b: fetchReferenceDataFailed({
            error: `Reference data not found for resource type ${ReferenceDataResourceType.HgvMake}`,
            resourceType: ReferenceDataResourceType.HgvMake
          })
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

    it.each(testCases)('should return fetchReferenceDataByKeyFailed action when resource not found', value => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const { resourceType } = value;
        actions$ = hot('-a--', { a: fetchReferenceDataByKey({ resourceType, resourceKey: 'xx' }) });

        jest.spyOn(referenceDataService, 'fetchReferenceDataByKey').mockReturnValue(cold('--a|', { a: {} }));

        expectObservable(effects.fetchReferenceDataByKey$).toBe('---b', {
          b: fetchReferenceDataByKeyFailed({ error: `Reference data not found for resource type ${resourceType},xx`, resourceType: resourceType })
        });
      });
    });
  });

  describe('fetchReferenceDataByKeySearch', () => {
    it('should return fetchReferenceDataByKeySearchSuccess on successful API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const resourceType = ReferenceDataResourceType.Tyres;
        const resourceKey = '123';
        const value = {
          payload: [
            {
              tyreCode: '123',
              resourceType: ReferenceDataResourceType.Tyres,
              resourceKey: '123',
              code: '123',
              loadIndexSingleLoad: '102',
              tyreSize: 'size',
              dateTimeStamp: 'time',
              userId: '1234',
              loadIndexTwinLoad: '101',
              plyRating: '18'
            }
          ]
        };
        const apiResponse = { data: [...value.payload] };

        actions$ = hot('-a--', { a: fetchReferenceDataByKeySearch({ resourceType, resourceKey }) });

        jest.spyOn(referenceDataService, 'fetchReferenceDataByKeySearch').mockReturnValue(cold('--a|', { a: apiResponse }));

        expectObservable(effects.fetchReferenceDataByKeySearch$).toBe('---b', {
          b: fetchReferenceDataByKeySearchSuccess({ resourceType, resourceKey, payload: value.payload as ReferenceDataModelBase[] })
        });
      });
    });

    it('should return fetchReferenceDataByKeySearchFailed on successful API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const resourceType = ReferenceDataResourceType.Tyres;
        actions$ = hot('-a--', { a: fetchReferenceDataByKeySearch({ resourceType, resourceKey: null as any }) });

        const expectedError = new Error('Reference data resourceKey is required');

        jest.spyOn(referenceDataService, 'fetchReferenceDataByKeySearch').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchReferenceDataByKeySearch$).toBe('---b', {
          b: fetchReferenceDataByKeySearchFailed({ error: 'Reference data resourceKey is required', resourceType: resourceType })
        });
      });
    });
  });

  describe('fetchTyreReferenceDataByKeySearch', () => {
    it('should return fetchTyreReferenceDataByKeySearchSuccess on successful API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const resourceType = ReferenceDataResourceType.Tyres;
        const value = {
          payload: [
            {
              tyreCode: '123',
              resourceType: ReferenceDataResourceType.Tyres,
              resourceKey: '123',
              code: '123',
              loadIndexSingleLoad: '102',
              tyreSize: 'size',
              dateTimeStamp: 'time',
              userId: '1234',
              loadIndexTwinLoad: '101',
              plyRating: '18'
            }
          ]
        };
        const apiResponse = { data: [...value.payload] };

        actions$ = hot('-a--', { a: fetchTyreReferenceDataByKeySearch({ searchFilter: 'plyRating', searchTerm: '123' }) });

        jest.spyOn(referenceDataService, 'fetchTyreReferenceDataByKeySearch').mockReturnValue(cold('--a|', { a: apiResponse }));

        expectObservable(effects.fetchTyreReferenceDataByKeySearch$).toBe('---b', {
          b: fetchTyreReferenceDataByKeySearchSuccess({ resourceType, payload: value.payload as ReferenceDataModelBase[] })
        });
      });
    });

    it('should return fetchTyreReferenceDataByKeySearchFailed on successful API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const resourceType = ReferenceDataResourceType.Tyres;
        actions$ = hot('-a--', { a: fetchTyreReferenceDataByKeySearch({ searchFilter: 'plyRating', searchTerm: null as any }) });

        const expectedError = new Error('Search term is required');

        jest.spyOn(referenceDataService, 'fetchTyreReferenceDataByKeySearch').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchTyreReferenceDataByKeySearch$).toBe('---b', {
          b: fetchTyreReferenceDataByKeySearchFailed({ error: 'Search term is required', resourceType: resourceType })
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
