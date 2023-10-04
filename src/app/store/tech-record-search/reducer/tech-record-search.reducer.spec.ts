import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { fetchSearchResult, fetchSearchResultFailed, fetchSearchResultSuccess } from '../actions/tech-record-search.actions';
import { SearchResultState, initialTechSearchResultState, techSearchResultReducer } from './tech-record-search.reducer';

describe('fetchSearchResults actions', () => {
  it('should set loading to true', () => {
    const newState: SearchResultState = { ...initialTechSearchResultState, loading: true };
    const action = fetchSearchResult({ term: 'foo' });
    const state = techSearchResultReducer(initialTechSearchResultState, action);

    expect(state).toEqual(newState);
    expect(state).not.toBe(newState);
  });

  describe('fetchSearchResultsSuccess', () => {
    it('should set all test result records', () => {
      const mockSearchResult = [
        {
          systemNumber: '123456',
          createdTimestamp: '10-22-10',
        },
      ] as TechRecordSearchSchema[];
      const newState: SearchResultState = {
        ...initialTechSearchResultState,
        ids: ['123456#10-22-10'],
        entities: { '123456#10-22-10': mockSearchResult[0] },
      };
      const action = fetchSearchResultSuccess({ payload: mockSearchResult });
      const state = techSearchResultReducer(initialTechSearchResultState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });

    describe('fetchSearchResultsFailed', () => {
      it('should set error state', () => {
        const newState = { ...initialTechSearchResultState, loading: false, error: ':cry:' };
        const action = fetchSearchResultFailed({ error: ':cry:' });
        const state = techSearchResultReducer({ ...initialTechSearchResultState, loading: true }, action);

        expect(state).toEqual(newState);
        expect(state).not.toBe(newState);
      });
    });
  });
});
