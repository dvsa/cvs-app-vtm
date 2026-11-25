import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { initialTechSearchResultState } from '../tech-record-search.reducer';
import {
	selectTechRecordSearchResults,
	selectTechRecordSearchResultsForDisplay,
	selectTechRecordSearchView,
} from '../tech-record-search.selector';

describe('Tech Record Search Selectors', () => {
	const record = (
		systemNumber: string,
		techRecord_statusCode: TechRecordSearchSchema['techRecord_statusCode'],
		createdTimestamp: string
	): TechRecordSearchSchema => ({
		systemNumber,
		techRecord_statusCode,
		createdTimestamp,
		vin: 'VIN123456789',
		techRecord_vehicleType: 'hgv',
		techRecord_manufactureYear: 2020,
	});
	const archived = record('123', 'archived', '2025-01-01T00:00:00.000Z');
	const provisional = record('123', 'provisional', '2025-02-01T00:00:00.000Z');
	const current = record('123', 'current', '2025-03-01T00:00:00.000Z');
	const otherArchived = record('456', 'archived', '2025-01-01T00:00:00.000Z');
	const otherCurrent = record('456', 'current', '2025-02-01T00:00:00.000Z');
	const olderArchived = record('123', 'archived', '2024-01-01T00:00:00.000Z');
	const results = [archived, provisional, otherArchived, current, olderArchived, otherCurrent];

	it('should return all records in state', () => {
		const state = { ...initialTechSearchResultState, ids: ['123'], entities: { 123: current } };
		expect(selectTechRecordSearchResults.projector(state)).toEqual([current]);
	});

	describe('selectTechRecordSearchResultsForDisplay', () => {
		it('should show every current and provisional match when archives are excluded', () => {
			expect(
				selectTechRecordSearchResultsForDisplay.projector(
					{ ...initialTechSearchResultState, includeArchived: false },
					results
				)
			).toEqual([provisional, current, otherCurrent]);
		});

		it('should show all archived versions after all current and provisional records without mutating results', () => {
			const original = [...results];
			expect(
				selectTechRecordSearchResultsForDisplay.projector(
					{ ...initialTechSearchResultState, includeArchived: true },
					results
				)
			).toEqual([provisional, current, otherCurrent, archived, otherArchived, olderArchived]);
			expect(results).toEqual(original);
		});

		it('should hide archive-only matches by default', () => {
			expect(selectTechRecordSearchResultsForDisplay.projector(initialTechSearchResultState, [archived])).toEqual([]);
		});
	});

	describe('selectTechRecordSearchView', () => {
		it('should offer archived matches when they are excluded and no visible records remain', () => {
			expect(
				selectTechRecordSearchView.projector({ ...initialTechSearchResultState, hasSearched: true }, [archived], [])
			).toEqual({ results: [], showNoRecords: true, hasArchivedRecords: true });
		});

		it.each([true, false])('should show no records for an empty search with includeArchived=%s', (includeArchived) => {
			expect(
				selectTechRecordSearchView.projector(
					{ ...initialTechSearchResultState, hasSearched: true, includeArchived },
					[],
					[]
				)
			).toEqual({ results: [], showNoRecords: true, hasArchivedRecords: false });
		});

		it.each([
			initialTechSearchResultState,
			{ ...initialTechSearchResultState, hasSearched: true, loading: true },
			{ ...initialTechSearchResultState, hasSearched: true, error: 'API error' },
		])('should not show no records before completion or on failure', (state) => {
			expect(selectTechRecordSearchView.projector(state, [], []).showNoRecords).toBe(false);
		});

		it('should not show an empty state or archive link when archived results are included', () => {
			expect(
				selectTechRecordSearchView.projector(
					{ ...initialTechSearchResultState, hasSearched: true, includeArchived: true },
					[archived],
					[archived]
				)
			).toEqual({ results: [archived], showNoRecords: false, hasArchivedRecords: false });
		});
	});
});
