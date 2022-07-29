import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { initialAppState } from '@store/.';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { fetchReferenceData, fetchReferenceDataByKey, fetchReferenceDataByKeyFailed, fetchReferenceDataByKeySuccess, fetchReferenceDataFailed, fetchReferenceDataSuccess } from '../actions/reference-data.actions';
import { testCases } from '../reference-data.test-cases';
import { ReferenceDataEffects } from './reference-data.effects';

describe('ReferenceDataEffects', () => {
  let effects: ReferenceDataEffects;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let referenceDataService: ReferenceDataService;

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
    referenceDataService = TestBed.inject(ReferenceDataService);
  });

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('fetchReferenceDataByType$', () => {
    it.each(testCases)('should return fetchReferenceDataSuccess action on successfull API call', (value) => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const { resourceType, payload } = value;

        // mock action to trigger effect
        actions$ = hot('-a--', { a: fetchReferenceData({ resourceType }) });

        // mock service call
        jest.spyOn(referenceDataService, 'fetchReferenceData').mockReturnValue(cold('--a|', { a: payload }));

        // expect effect to return success action
        expectObservable(effects.fetchReferenceDataByType$).toBe('---b', {
          b: fetchReferenceDataSuccess({ resourceType, payload })
        });
      });
    });

    it.each(testCases)('should return fetchReferenceDataFailed action on API error', (value) => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const { resourceType, payload } = value;
        actions$ = hot('-a--', { a: fetchReferenceData({ resourceType: null as any }) });

        const expectedError = new Error('Reference data resourceType is required');

        jest.spyOn(referenceDataService, 'fetchReferenceData').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchReferenceDataByType$).toBe('---b', { b: fetchReferenceDataFailed({ error: 'Reference data resourceType is required' }) });
      });
    });
  });

  describe('fetchReferenceDataByKey$', () => {
    it.each(testCases)('should return fetchReferenceDataByKeySuccess action on successfull API call', (value) => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const { resourceType, resourceKey, payload } = value;
        const entity = payload.find(p => p.resourceKey === resourceKey)!;

        // mock action to trigger effect
        actions$ = hot('-a--', { a: fetchReferenceDataByKey({ resourceType, resourceKey }) });

        // mock service call
        jest.spyOn(referenceDataService, 'fetchReferenceData').mockReturnValue(cold('--a|', { a: entity }));

        // expect effect to return success action
        expectObservable(effects.fetchReferenceDataByKey$).toBe('---b', {
          b: fetchReferenceDataByKeySuccess({ resourceType, resourceKey, payload: entity })
        });
      });
    });

    it.each(testCases)('should return fetchReferenceDataByKeyFailed action on API error', (value) => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const { resourceType, resourceKey, payload } = value;
        actions$ = hot('-a--', { a: fetchReferenceDataByKey({ resourceType, resourceKey: null as any }) });

        const expectedError = new Error('Reference data resourceKey is required');

        jest.spyOn(referenceDataService, 'fetchReferenceData').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchReferenceDataByKey$).toBe('---b', { b: fetchReferenceDataByKeyFailed({ error: 'Reference data resourceKey is required' }) });
      });
    });
  });
});
