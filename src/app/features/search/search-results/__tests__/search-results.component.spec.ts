import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { Roles } from '@/src/app/models/roles.enum';
import { SEARCH_TYPES } from '@/src/app/models/search-types-enum';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { UserService } from '@/src/app/services/user-service/user-service';
import { initialAppState } from '@/src/app/store';
import {
	initialTechSearchResultState,
	techSearchResultAdapter,
} from '@/src/app/store/tech-record-search/tech-record-search.reducer';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { SearchFormComponent } from '../../search-form/search-form.component';
import { SearchResultComponent } from '../search-result/search-result.component';
import { SearchResultsComponent } from '../search-results.component';

@Component({ template: '' })
class CreatePageComponent {}

describe('SearchResultsComponent', () => {
	let harness: RouterTestingHarness;
	let store: MockStore;
	let router: Router;
	let techRecordService: TechnicalRecordService;

	const result = (
		systemNumber: string,
		techRecord_statusCode: TechRecordSearchSchema['techRecord_statusCode'],
		createdTimestamp: string
	): TechRecordSearchSchema => ({
		systemNumber,
		createdTimestamp,
		techRecord_statusCode,
		techRecord_vehicleType: 'hgv',
		vin: 'VIN123456789',
		primaryVrm: 'ABC123',
		techRecord_manufactureYear: 2020,
	});
	const archived = result('123', 'archived', '2025-01-01T00:00:00.000Z');
	const provisional = result('123', 'provisional', '2025-02-01T00:00:00.000Z');
	const current = result('123', 'current', '2025-03-01T00:00:00.000Z');

	const setResults = (records: TechRecordSearchSchema[], includeArchived = false) => {
		store.setState({
			...initialAppState,
			techSearchResults: techSearchResultAdapter.setAll(records, {
				...initialTechSearchResultState,
				hasSearched: true,
				includeArchived,
			}),
		});
		harness.detectChanges();
		harness.detectChanges();
	};

	const renderedResults = (): TechRecordSearchSchema[] =>
		harness.routeDebugElement
			?.queryAll(By.directive(SearchResultComponent))
			.map((element) => element.componentInstance.searchResult()) ?? [];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				provideRouter([
					{ path: 'search/results', component: SearchResultsComponent },
					{ path: 'create', component: CreatePageComponent },
				]),
				{
					provide: UserService,
					useValue: { roles$: of([...Roles.TechRecordView.split(','), ...Roles.TechRecordCreate.split(',')]) },
				},
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		router = TestBed.inject(Router);
		techRecordService = TestBed.inject(TechnicalRecordService);
		harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(
			'/search/results?searchTerm=ABC123&searchCriteria=primaryVrm&includeArchived=false',
			SearchResultsComponent
		);
	});

	it('should clear errors and search using query parameters, including the archive toggle', async () => {
		const searchSpy = vi.spyOn(techRecordService, 'searchBy');
		const clearErrorsSpy = vi.spyOn(TestBed.inject(GlobalErrorService), 'clearErrors');
		await router.navigate(['/search/results'], {
			queryParams: { searchTerm: 'foo', searchCriteria: SEARCH_TYPES.ALL, includeArchived: true },
		});
		expect(clearErrorsSpy).toHaveBeenCalled();
		expect(searchSpy).toHaveBeenCalledWith(SEARCH_TYPES.ALL, 'foo', true);
	});

	it('should display current and provisional records above all archived versions', () => {
		setResults([archived, provisional, current], true);
		expect(renderedResults()).toEqual([provisional, current, archived]);
	});

	it('should only display current and provisional records when archives are excluded', () => {
		setResults([archived, provisional, current]);
		expect(renderedResults()).toEqual([provisional, current]);
		expect(harness.routeNativeElement?.querySelector('#no-records-found')).toBeNull();
	});

	it('should keep the search form visible and offer excluded archive-only matches', async () => {
		setResults([archived]);
		const form = harness.routeDebugElement?.query(By.directive(SearchFormComponent))
			.componentInstance as SearchFormComponent;
		expect(form.form.controls.includeArchived.value).toBe(false);

		const searchSpy = vi.spyOn(techRecordService, 'searchBy');
		const link = harness.routeNativeElement?.querySelector<HTMLAnchorElement>('#archived-records-link');
		expect(link?.textContent).toBe('archived records matching your search');
		link?.click();
		await harness.fixture.whenStable();
		harness.detectChanges();

		expect(searchSpy).toHaveBeenCalledWith(SEARCH_TYPES.VRM, 'ABC123', true);
		expect(form.form.controls.includeArchived.value).toBe(true);
		expect(router.parseUrl(router.url).queryParams['search-results-page']).toBe('1');
		setResults([archived], true);
		expect(renderedResults()).toEqual([archived]);
		expect(harness.routeNativeElement?.querySelector('#no-records-found')).toBeNull();
	});

	it.each([true, false])(
		'should show no records without an archive link for an empty search (archives=%s)',
		(includeArchived) => {
			setResults([], includeArchived);
			expect(harness.routeNativeElement?.querySelector('#archived-records-link')).toBeNull();
			expect(harness.routeNativeElement?.querySelector('app-search-form')).not.toBeNull();
		}
	);

	it('should navigate to the creation page from the empty state', async () => {
		setResults([]);
		harness.routeNativeElement?.querySelector<HTMLAnchorElement>('#create-technical-record-link')?.click();
		await harness.fixture.whenStable();
		expect(router.url).toBe('/create');
	});

	it('should not show an empty state before a search completes or after an API error', () => {
		expect(harness.routeNativeElement?.querySelector('#no-records-found')).toBeNull();
		store.setState({
			...initialAppState,
			techSearchResults: { ...initialTechSearchResultState, loading: true },
		});
		harness.detectChanges();
		expect(harness.routeNativeElement?.querySelector('#no-records-found')).toBeNull();
		store.setState({
			...initialAppState,
			techSearchResults: { ...initialTechSearchResultState, error: 'API failed' },
		});
		harness.detectChanges();
		expect(harness.routeNativeElement?.querySelector('#no-records-found')).toBeNull();
	});

	it('should order records before paginating, even when vehicles share timestamps', async () => {
		const otherCurrent = result('456', 'current', current.createdTimestamp);
		const otherProvisional = result('456', 'provisional', provisional.createdTimestamp);
		const otherArchived = result('456', 'archived', archived.createdTimestamp);
		const records = [archived, provisional, otherArchived, current, otherCurrent, otherProvisional];
		setResults(records, true);
		expect(renderedResults()).toEqual([provisional, current, otherCurrent, otherProvisional]);
		await router.navigate([], { queryParams: { 'search-results-page': 2 }, queryParamsHandling: 'merge' });
		harness.detectChanges();
		expect(renderedResults()).toEqual([archived, otherArchived]);
	});

	it('should reset pagination when applying a filter that reduces the results', async () => {
		await router.navigate([], {
			queryParams: { includeArchived: true, 'search-results-page': 2 },
			queryParamsHandling: 'merge',
		});
		const records = [
			current,
			...['1', '2', '3', '4'].map((systemNumber) => result(systemNumber, 'archived', archived.createdTimestamp)),
		];
		setResults(records, true);
		expect(renderedResults()).toEqual([records[4]]);

		const form = harness.routeDebugElement?.query(By.directive(SearchFormComponent))
			.componentInstance as SearchFormComponent;
		form.form.controls.includeArchived.setValue(false);
		form.search();
		await harness.fixture.whenStable();
		setResults(records);

		expect(router.parseUrl(router.url).queryParams['search-results-page']).toBe('1');
		expect(renderedResults()).toEqual([current]);
	});
});
