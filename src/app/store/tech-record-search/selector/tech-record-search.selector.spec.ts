import { SearchResult, initialTechSearchResultState } from '../reducer/tech-record-search.reducer';
import { selectTechRecordSearchResults, selectTechRecordSearchResultsBySystemNumber } from './tech-record-search.selector';

describe('Tech Record Search Selectors', () => {
  describe('selectTechRecordsSearchResults', () => {
    it('should return the records in state', () => {
      const state = { ...initialTechSearchResultState, ids: [1], entities: { [1]: { systemNumber: '123' } as SearchResult } };
      const selectedState = selectTechRecordSearchResults.projector(state);
      expect(selectedState).toEqual([{ systemNumber: '123' }]);
    });
  });
  describe('selectTechRecordsSearchResultsBySystemNumber', () => {
    const testCases = [
      {
        results: [
          {
            systemNumber: '123456'
          },
          {
            systemNumber: '123456'
          },
          {
            systemNumber: '123456'
          },
          {
            systemNumber: '123456'
          }
        ]
      },
      {
        results: [
          {
            systemNumber: '123456'
          },
          {
            systemNumber: '7545677'
          },
          {
            systemNumber: '123456'
          },
          {
            systemNumber: '12'
          }
        ]
      },
      {
        results: [
          {
            systemNumber: '4444'
          },
          {
            systemNumber: '4444'
          },
          {
            systemNumber: '123456'
          },
          {
            systemNumber: '12'
          }
        ]
      }
    ] as { results: SearchResult[] }[];

    it.each(testCases)('should group the search results by systemNumber', ({ results }) => {
      const selectedState = selectTechRecordSearchResultsBySystemNumber.projector(results);
      const expectedLength = new Set(results.map(r => r.systemNumber)).size;
      expect(selectedState).toHaveLength(expectedLength);
    });
    const now = new Date();
    const oneDayAgo = new Date();
    oneDayAgo.setDate(new Date().getDate() - 1);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(new Date().getDate() - 2);
    const statusCases = [
      {
        results: [
          {
            systemNumber: '123456',
            techRecord_statusCode: 'current'
          },
          {
            systemNumber: '123456'
          },
          {
            systemNumber: '123456'
          },
          {
            systemNumber: '123456'
          }
        ],
        status: 'current'
      },
      {
        results: [
          {
            systemNumber: '123456'
          },
          {
            systemNumber: '123456'
          },
          {
            systemNumber: '123456',
            techRecord_statusCode: 'provisional'
          },
          {
            systemNumber: '123456'
          }
        ],

        status: 'provisional'
      },
      {
        results: [
          {
            systemNumber: '123456'
          },
          {
            systemNumber: '123456',
            techRecord_statusCode: 'current'
          },
          {
            systemNumber: '123456',
            techRecord_statusCode: 'provisional'
          },
          {
            systemNumber: '123456'
          }
        ],
        status: 'current'
      },
      {
        results: [
          {
            systemNumber: '123456',
            createdTimestamp: twoDaysAgo.toISOString()
          },
          {
            systemNumber: '123456',
            createdTimestamp: oneDayAgo.toISOString()
          },
          {
            systemNumber: '123456',
            createdTimestamp: now.toISOString(),
            techRecord_statusCode: 'this is the right record'
          }
        ],
        status: 'this is the right record'
      }
    ] as { results: SearchResult[]; status: string }[];
    it.each(statusCases)('should group the search results by systemNumber', ({ results, status }) => {
      const selectedState = selectTechRecordSearchResultsBySystemNumber.projector(results);
      expect(selectedState[0].techRecord_statusCode).toBe(status);
    });
  });
});
