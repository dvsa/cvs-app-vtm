import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CacheKeys } from '@models/cache-keys.enum';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { HttpCacheManager } from '@ngneat/cashew';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HttpService } from '@services/http/http.service';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { Observable, firstValueFrom, of, throwError, toArray } from 'rxjs';
import { fetchDefects, fetchDefectsComplete } from '../defects/defects.actions';
import { DefectsEffects } from '../defects/defects.effects';
import { initialAppState } from '../index';
import {
	deleteReferenceDataItemSuccess,
	fetchReasonsForAbandoning,
	fetchReferenceData,
	fetchReferenceDataComplete,
} from '../reference-data/reference-data.actions';
import { ReferenceDataEffects } from '../reference-data/reference-data.effects';
import { getRequiredStandards, getRequiredStandardsComplete } from '../required-standards/required-standards.actions';
import { RequiredStandardsEffects } from '../required-standards/required-standards.effects';
import { fetchSearchResult, fetchSearchResultFailed } from '../tech-record-search/tech-record-search.actions';
import { TechSearchResultsEffects } from '../tech-record-search/tech-record-search.effect';
import { testResultInEdit } from '../test-records';
import { fetchTestStations, fetchTestStationsComplete } from '../test-stations/test-stations.actions';
import { TestStationsEffects } from '../test-stations/test-stations.effects';
import { fetchTestTypes, fetchTestTypesComplete } from '../test-types/test-types.actions';
import { TestTypeEffects } from '../test-types/test-types.effects';

const cases = [
	{
		name: 'defects',
		effect: DefectsEffects,
		property: 'fetchDefects$',
		action: fetchDefects(),
		complete: fetchDefectsComplete(),
		key: CacheKeys.DEFECTS,
		method: 'fetchDefects',
	},
	{
		name: 'required standards',
		effect: RequiredStandardsEffects,
		property: 'getRequiredStandards$',
		action: getRequiredStandards({ euVehicleCategory: 'm1' }),
		complete: getRequiredStandardsComplete(),
		key: `${CacheKeys.REQUIRED_STANDARDS}m1`,
		method: 'fetchRequiredStandards',
	},
	{
		name: 'test stations',
		effect: TestStationsEffects,
		property: 'fetchTestStations$',
		action: fetchTestStations(),
		complete: fetchTestStationsComplete(),
		key: CacheKeys.TEST_STATIONS,
		method: 'fetchTestStations',
	},
	{
		name: 'test types',
		effect: TestTypeEffects,
		property: 'fetchTestTypeTaxonomy$',
		action: fetchTestTypes(),
		complete: fetchTestTypesComplete(),
		key: CacheKeys.TEST_TYPES,
		method: 'getTestTypes',
	},
	{
		name: 'reference data',
		effect: ReferenceDataEffects,
		property: 'fetchReferenceDataByType$',
		action: fetchReferenceData({ resourceType: ReferenceDataResourceType.Brakes }),
		complete: fetchReferenceDataComplete({ resourceType: ReferenceDataResourceType.Brakes }),
		key: `${CacheKeys.REFERENCE_DATA}${ReferenceDataResourceType.Brakes}undefined`,
		method: 'fetchReferenceData',
	},
];

describe('NgRx effect cache and failure paths', () => {
	let actions$: Observable<Action>;
	let store: MockStore;
	let cache: { has: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };
	let http: Record<string, ReturnType<typeof vi.fn>>;
	let references: { fetchReferenceData: ReturnType<typeof vi.fn> };
	let navigate: ReturnType<typeof vi.fn>;
	let clearErrors: ReturnType<typeof vi.fn>;
	const bucket = {};

	beforeEach(() => {
		actions$ = of();
		cache = { has: vi.fn().mockReturnValue(true), delete: vi.fn() };
		http = {
			fetchDefects: vi.fn(),
			fetchRequiredStandards: vi.fn(),
			fetchTestStations: vi.fn(),
			getTestTypes: vi.fn(),
			searchTechRecords: vi.fn(),
			getRefDataBucket: vi.fn().mockReturnValue(bucket),
		};
		references = { fetchReferenceData: vi.fn() };
		navigate = vi.fn().mockResolvedValue(true);
		clearErrors = vi.fn();
		TestBed.configureTestingModule({
			providers: [
				DefectsEffects,
				RequiredStandardsEffects,
				TestStationsEffects,
				TestTypeEffects,
				ReferenceDataEffects,
				TechSearchResultsEffects,
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
				{ provide: HttpCacheManager, useValue: cache },
				{ provide: HttpService, useValue: http },
				{ provide: ReferenceDataService, useValue: references },
				{ provide: Router, useValue: { navigate } },
				{ provide: GlobalErrorService, useValue: { clearErrors } },
				{ provide: UserService, useValue: { roles$: of([]) } },
			],
		});
		store = TestBed.inject(MockStore);
		vi.spyOn(store, 'dispatch');
	});

	it.each(cases)(
		'stops loading cached $name without sending another API request',
		async ({ effect, property, action, complete, key, method }) => {
			actions$ = of(action);
			const instance = TestBed.inject(effect) as any;
			expect(await firstValueFrom(instance[property].pipe(toArray()))).toEqual([]);
			expect(cache.has).toHaveBeenCalledWith(key);
			expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(complete);
			expect((method === 'fetchReferenceData' ? references : http)[method]).not.toHaveBeenCalled();
		}
	);

	it('requests unrestricted test types when the user has no desk-assessment role', async () => {
		cache.has.mockReturnValue(false);
		http['getTestTypes'].mockReturnValue(of([]));
		actions$ = of(fetchTestTypes());
		await firstValueFrom(TestBed.inject(TestTypeEffects).fetchTestTypeTaxonomy$);
		expect(http['getTestTypes']).toHaveBeenCalledExactlyOnceWith(undefined);
	});

	it('invalidates the deleted resource bucket, returns to its list, and clears errors', async () => {
		actions$ = of(
			deleteReferenceDataItemSuccess({ resourceType: ReferenceDataResourceType.Brakes, resourceKey: 'B-1' })
		);
		await firstValueFrom(TestBed.inject(ReferenceDataEffects).deleteReferenceDataItemSuccess$);
		expect(http['getRefDataBucket']).toHaveBeenCalledExactlyOnceWith(ReferenceDataResourceType.Brakes);
		expect(cache.delete).toHaveBeenCalledExactlyOnceWith(bucket);
		expect(navigate).toHaveBeenCalledExactlyOnceWith(['reference-data', ReferenceDataResourceType.Brakes]);
		expect(clearErrors).toHaveBeenCalledOnce();
	});

	it('reports unsupported vehicle types when loading abandonment reasons', async () => {
		store.overrideSelector(testResultInEdit, undefined);
		actions$ = of(fetchReasonsForAbandoning());
		await expect(firstValueFrom(TestBed.inject(ReferenceDataEffects).fetchReasonsForAbandoning)).rejects.toThrow(
			'Unexpected vehicle type'
		);
	});

	it.each([
		[
			SEARCH_TYPES.ALL,
			new HttpErrorResponse({ status: 500 }),
			'There was a problem getting the Tech Record by the current search criteria',
		],
		[
			undefined,
			new HttpErrorResponse({ status: 500, error: { message: 'Unavailable' } }),
			'There was a problem getting the Tech Record by {"message":"Unavailable"}',
		],
		[SEARCH_TYPES.ALL, 'Search temporarily unavailable', 'Search temporarily unavailable'],
		[
			SEARCH_TYPES.ALL,
			{ status: 404 },
			'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number',
		],
	] as const)('reports a search error for criteria %s', async (searchBy, error, expected) => {
		http['searchTechRecords'].mockReturnValue(throwError(() => error));
		actions$ = of(fetchSearchResult({ term: 'VIN-1', searchBy }));
		expect(await firstValueFrom(TestBed.inject(TechSearchResultsEffects).fetchSearchResults$)).toEqual(
			fetchSearchResultFailed({ error: expected, anchorLink: 'search-term' })
		);
	});
});
