import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { initialReferenceDataState } from '../reference-data/reference-data.reducer';
import { getUserNames } from '../reference-data/reference-data.selectors';
import * as router from '../router/router.selectors';
import * as technical from '../technical-records/technical-record-service.selectors';
import * as results from '../test-records/test-records.selectors';
import * as stations from '../test-stations/test-stations.selectors';
import { initialTestTypeState, testTypesAdapter } from '../test-types/test-types.reducer';
import * as types from '../test-types/test-types.selectors';

describe('NgRx selector edge cases', () => {
	it('selects router URL, current route and edit mode without retaining the leading slash', () => {
		const route = { params: { id: '1' }, data: { title: 'Record' } };
		const state = { state: { url: '/tech-records/1', root: route } };
		expect(router.selectMergedRouteUrl.projector(state.state)).toBe('tech-records/1');
		expect(router.routerState.projector(state)).toBe(state);
		expect(router.currentRouteState.projector(route)).toBe(route);
		expect(router.routeEditable.projector('true')).toBe(true);
		expect(router.routeEditable.projector('false')).toBe(false);
		expect(router.routeEditable.projector(undefined)).toBe(false);
		expect(router.selectMergedRouteUrl.projector(undefined)).toBeUndefined();
	});

	it('returns user names from entity values instead of entity-state metadata', () => {
		const state = {
			...initialReferenceDataState,
			[ReferenceDataResourceType.User]: {
				ids: ['one', 'missing', 'two'],
				loading: false,
				entities: {
					one: { resourceKey: 'one', name: 'First Examiner' },
					missing: undefined,
					two: { resourceKey: 'two', name: 'Second Examiner' },
				},
			},
		};
		expect(getUserNames.projector(state)).toEqual(['First Examiner', 'Second Examiner']);
		expect(getUserNames.projector(initialReferenceDataState)).toEqual([]);
	});

	it('selects test station names without changing their order', () => {
		expect(stations.testStationNames.projector([{ testStationName: 'First' }, { testStationName: 'Second' }])).toEqual([
			'First',
			'Second',
		]);
	});

	it('exposes test-type IDs, entities and totals through entity selectors', () => {
		const state = testTypesAdapter.setAll([{ id: 'one' }, { id: 'two' }] as any, initialTestTypeState);
		expect(types.selectTestTypesIds.projector(state)).toEqual(['one', 'two']);
		expect(types.selectTestTypesEntities.projector(state)).toEqual({ one: { id: 'one' }, two: { id: 'two' } });
		expect(types.selectTestTypesTotal.projector(state)).toBe(2);
	});

	it('sorts saved technical-record history without mutating a frozen state array', () => {
		const history = Object.freeze([
			{ createdTimestamp: '2026-01-01' },
			{ createdTimestamp: '2026-11-09' },
			{ createdTimestamp: '2026-06-01' },
			{ createdTimestamp: '2026-06-01' },
		]);
		expect(
			technical.selectTechRecordHistory.projector({ techRecordHistory: history })?.map((item) => item.createdTimestamp)
		).toEqual(['2026-11-09', '2026-06-01', '2026-06-01', '2026-01-01']);
		expect(history[0].createdTimestamp).toBe('2026-01-01');
	});

	it('excludes the viewed current record while offering a different current record for provisional views', () => {
		const current = { techRecord_statusCode: 'current' } as TechRecordType<'get'>;
		expect(technical.selectNonViewedCurrentTechRecordFromHistory.projector(current, current)).toBeUndefined();
		expect(
			technical.selectNonViewedCurrentTechRecordFromHistory.projector({ techRecord_statusCode: 'provisional' }, current)
		).toBe(current);
		expect(technical.selectNonViewedCurrentTechRecordFromHistory.projector(undefined, undefined)).toBeUndefined();
	});

	it.each([undefined, { testTypes: [] }, { testTypes: [{}] }])('handles absent defect arrays (%j)', (testResult) => {
		expect(results.selectDefectData.projector(testResult)).toEqual([]);
		expect(results.selectAmendedDefectData.projector(testResult)).toEqual([]);
	});

	it('does not select an amended test type with a different test number', () => {
		expect(
			results.selectedTestResultState.projector(
				{ result: { testTypes: [{ testNumber: 'other' }] } },
				{ testResultId: 'result', testNumber: 'requested' }
			)
		).toBeUndefined();
		expect(
			results.selectedAmendedTestResultState.projector(
				{ testHistory: [{ createdAt: 'timestamp', testTypes: [{ testNumber: 'other' }] }] },
				{ createdAt: 'timestamp', testNumber: 'requested' }
			)
		).toBeUndefined();
		expect(results.selectTestByRouteTestNumber.projector(undefined)).toBeUndefined();
	});

	it('sorts test results by date without changing another selector’s cached array', () => {
		const same = { testResultId: 'same', createdAt: '2026-06-01' };
		const records = Object.freeze([
			{ testResultId: 'old', createdAt: '2026-01-01' },
			{ testResultId: 'missing' },
			same,
			same,
			{ testResultId: 'new', createdAt: '2026-11-09' },
		]);
		expect(results.selectAllTestResultsInDateOrder.projector(records).map((item) => item.testResultId)).toEqual([
			'new',
			'same',
			'same',
			'old',
			'missing',
		]);
		expect(records[0].testResultId).toBe('old');
	});

	it('sorts taxonomy categories and nested tests without mutating frozen inputs', () => {
		const children = Object.freeze([
			{ id: 'late-child', sortId: '10' },
			{ id: 'early-child', sortId: '2' },
		]);
		const taxonomy = Object.freeze([
			{ id: 'late', sortId: '10' },
			{ id: 'unsorted' },
			{ id: 'first', sortId: '' },
			{ id: 'nested', sortId: '2', nextTestTypesOrCategories: children },
		]);
		const result = types.sortedTestTypes.projector(taxonomy);
		expect(result.map((item) => item.id)).toEqual(['unsorted', 'first', 'nested', 'late']);
		expect((result[2] as any).nextTestTypesOrCategories.map((item: any) => item.id)).toEqual([
			'early-child',
			'late-child',
		]);
		expect(children[0].id).toBe('late-child');
		expect(taxonomy[0].id).toBe('late');
	});

	it.each([
		['2026-05-08', false],
		['2026-05-09', true],
		['2026-05-10', true],
	] as const)('enforces the six-month ADR application boundary for %s', (receivedDate, available) => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-11-09T12:00:00Z'));
		const taxonomy = [{ id: '50', forVehicleType: [VehicleTypes.HGV] }];
		const result = types.selectTestTypesByVehicleType.projector(
			taxonomy,
			{ vehicleType: VehicleTypes.HGV } as TestResultSchema,
			[],
			{
				techRecord_vehicleType: VehicleTypes.HGV,
				techRecord_statusCode: 'current',
				techRecord_adrDetails_dangerousGoods: true,
				techRecord_adrDetails_approved: true,
				techRecord_adrDetails_receivedDate: receivedDate,
			},
			{ 'hide-test-restriction-functionality': { enabled: false } }
		);
		expect(result.map((item) => item.id)).toEqual(available ? ['50'] : []);
	});

	it.each([
		{ approved: false, receivedDate: '2026-11-01' },
		{ approved: true, receivedDate: undefined },
	])('blocks ADR tests without an approved, dated application (%j)', ({ approved, receivedDate }) => {
		expect(
			types.selectTestTypesByVehicleType.projector(
				[{ id: '50' }],
				{ vehicleType: VehicleTypes.HGV },
				undefined,
				{
					techRecord_vehicleType: VehicleTypes.HGV,
					techRecord_adrDetails_dangerousGoods: true,
					techRecord_adrDetails_approved: approved,
					techRecord_adrDetails_receivedDate: receivedDate,
				},
				{ 'hide-test-restriction-functionality': { enabled: false } }
			)
		).toEqual([]);
	});
});
