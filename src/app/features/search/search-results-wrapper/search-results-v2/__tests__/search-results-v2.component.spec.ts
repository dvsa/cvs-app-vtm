import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { SEARCH_TYPES } from '@/src/app/models/search-types-enum';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { initialAppState } from '@/src/app/store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { SearchResultsV2Component } from '../search-results-v2.component';

describe('SearchResultsV2Component', () => {
	let fixture: ComponentFixture<SearchResultsV2Component>;
	let component: SearchResultsV2Component;
	let router: Router;
	let techRecordService: TechnicalRecordService;
	let globalErrorService: GlobalErrorService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SearchResultsV2Component],
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				provideRouter([{ path: 'search/results', component: SearchResultsV2Component }]),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(SearchResultsV2Component);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
		techRecordService = TestBed.inject(TechnicalRecordService);
		globalErrorService = TestBed.inject(GlobalErrorService);

		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should search for the record using the query params from the url', async () => {
			const searchSpy = jest.spyOn(techRecordService, 'searchBy');
			const clearErrorsSpy = jest.spyOn(globalErrorService, 'clearErrors');
			component.ngOnInit();
			await router.navigate(['/search/results'], {
				queryParams: { searchTerm: 'foo', searchCriteria: SEARCH_TYPES.ALL },
			});
			expect(clearErrorsSpy).toHaveBeenCalled();
			expect(searchSpy).toHaveBeenCalledWith(SEARCH_TYPES.ALL, 'foo', false);
		});
	});
});
