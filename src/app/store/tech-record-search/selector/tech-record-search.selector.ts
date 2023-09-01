import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { createSelector } from '@ngrx/store';
import { techSearchResultAdapter, techSearchResultFeatureState } from '../reducer/tech-record-search.reducer';

const { selectAll } = techSearchResultAdapter.getSelectors();

export const selectTechRecordSearchLoadingState = createSelector(techSearchResultFeatureState, state => state.loading);
export const selectTechRecordSearchResults = createSelector(techSearchResultFeatureState, state => selectAll(state));

export const selectTechRecordSearchResultsBySystemNumber = createSelector(selectTechRecordSearchResults, searchResults => {
  const records: TechRecordSearchSchema[] = [];
  const visitedSystemNumbers = new Set<string>();
  searchResults.forEach(result => {
    if (!visitedSystemNumbers.has(result.systemNumber)) {
      visitedSystemNumbers.add(result.systemNumber);
      const recordsWithSameSystemNumber = searchResults.filter(record => record.systemNumber === result.systemNumber);
      const mostCurrentRecord =
        recordsWithSameSystemNumber.find(r => r.techRecord_statusCode === 'current') ??
        recordsWithSameSystemNumber.find(r => r.techRecord_statusCode === 'provisional') ??
        recordsWithSameSystemNumber.find(
          r =>
            new Date(r.createdTimestamp).getTime() === Math.max(...recordsWithSameSystemNumber.map(rec => new Date(rec.createdTimestamp).getTime()))
        ) ??
        records[0];
      records.push(mostCurrentRecord);
    }
  });
  return records;
});
