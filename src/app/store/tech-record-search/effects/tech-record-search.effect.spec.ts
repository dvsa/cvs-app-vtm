import { SEARCH_TYPES, TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import { fetchSearchResult, fetchSearchResultFailed, fetchSearchResultSuccess } from '../actions/tech-record-search.actions';
import { TechSearchResultsEffects } from './tech-record-search.effect';
import { SearchResult } from '../reducer/tech-record-search.reducer';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';

describe('DefectsEffects', () => {
  let effects: TechSearchResultsEffects;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let service: TechnicalRecordHttpService;

  const expectedResult = { systemNumber: '1' } as SearchResult;
  const testCases = [
    {
      id: expectedResult.systemNumber,
      payload: [expectedResult]
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TechSearchResultsEffects,
        provideMockActions(() => actions$),
        TechnicalRecordHttpService,
        provideMockStore({
          initialState: initialAppState
        })
      ]
    });

    effects = TestBed.inject(TechSearchResultsEffects);
    service = TestBed.inject(TechnicalRecordHttpService);
  });

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('fetchSearchResults$', () => {
    it.each(testCases)('should return fetchSearchResultsSuccess action on successfull API call', value => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const { payload } = value;

        // mock action to trigger effect
        actions$ = hot('-a--', { a: fetchSearchResult });

        // mock service call
        jest.spyOn(service, 'search$').mockReturnValue(cold('--a|', { a: payload }));

        // expect effect to return success action
        expectObservable(effects.fetchSearchResults$).toBe('---b', {
          b: fetchSearchResultSuccess({ payload })
        });
      });
    });

    it.each(testCases)('should return fetchSearchResults action on API error', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a--', { a: fetchSearchResult({ searchBy: SEARCH_TYPES.VIN, term: 'foo' }) });

        const expectedError = new Error('Oopsi');

        jest.spyOn(service, 'search$').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchSearchResults$).toBe('---b', {
          b: fetchSearchResultFailed({ error: 'There was a problem getting the Tech Record by vin', anchorLink: 'search-term' })
        });
      });
    });
  });
});
