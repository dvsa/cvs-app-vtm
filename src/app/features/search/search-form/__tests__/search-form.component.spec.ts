import { GlobalError } from '@/src/app/core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { SEARCH_TYPES } from '@/src/app/models/search-types-enum';
import { initialAppState } from '@/src/app/store';
import { clearAllSectionStates, clearScrollPosition } from '@/src/app/store/technical-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { SearchResultsComponent } from '../../search-results/search-results.component';
import { SearchFormComponent } from '../search-form.component';

const mockGlobalErrorService = {
	setErrors: jest.fn(),
	clearErrors: jest.fn(),
	extractGlobalErrors: jest.fn(),
};

describe('SearchFormComponent', () => {
	let fixture: ComponentFixture<SearchFormComponent>;
	let component: SearchFormComponent;
	let router: Router;
	let globalErrorService: GlobalErrorService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SearchFormComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideRouter([{ path: 'search/results', component: SearchResultsComponent }]),
				{ provide: GlobalErrorService, useValue: mockGlobalErrorService },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(SearchFormComponent);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
		globalErrorService = TestBed.inject(GlobalErrorService);

		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should patch the form with queryParams from the url', async () => {
			const patchSpy = jest.spyOn(component.form, 'patchValue');
			component.ngOnInit();
			await router.navigate(['/search/results'], { queryParams: { searchTerm: 'foo', searchCriteria: 'bar' } });
			expect(patchSpy).toHaveBeenCalledWith({ searchTerm: 'foo', searchCriteria: 'bar', includeArchived: false });
		});
	});

	describe('ngOnDestroy', () => {
		it('should next and complete the destroy subject', () => {
			const nextSpy = jest.spyOn(component.destroy, 'next');
			const completeSpy = jest.spyOn(component.destroy, 'complete');
			component.ngOnDestroy();
			expect(nextSpy).toHaveBeenCalled();
			expect(completeSpy).toHaveBeenCalled();
		});
	});

	describe('search', () => {
		it('should clear all global errors, section state, and cursor position', () => {
			const dispatchSpy = jest.spyOn(component.store, 'dispatch');
			const clearErrorsSpy = jest.spyOn(globalErrorService, 'clearErrors');
			const markAllAsTouchedSpy = jest.spyOn(component.form, 'markAllAsTouched');
			component.search();
			expect(dispatchSpy).toHaveBeenCalledWith(clearAllSectionStates());
			expect(dispatchSpy).toHaveBeenCalledWith(clearScrollPosition());
			expect(clearErrorsSpy).toHaveBeenCalled();
			expect(markAllAsTouchedSpy).toHaveBeenCalled();
		});

		it('should, if the form is invalid, dispatch the set errors action', () => {
			const errors: GlobalError[] = [
				{
					error: 'You must provide a vehicle registration mark, trailer ID or vehicle identification number.',
					anchorLink: 'search-term',
				},
			];
			jest.spyOn(globalErrorService, 'extractGlobalErrors').mockReturnValue(errors);
			const setErrorsSpy = jest.spyOn(globalErrorService, 'setErrors');
			component.form.patchValue({ searchTerm: '', searchCriteria: 'bar' }); // invalid form state
			component.search();
			expect(setErrorsSpy).toHaveBeenCalledWith(errors);
		});

		it('should, if the form is valid, navigate to the search results page', () => {
			const navigateSpy = jest.spyOn(router, 'navigate');
			component.form.patchValue({ searchTerm: 'foo', searchCriteria: SEARCH_TYPES.ALL });
			component.search();
			expect(navigateSpy).toHaveBeenCalledWith(['/search/results'], {
				queryParams: { searchTerm: 'foo', searchCriteria: 'all', includeArchived: false },
				queryParamsHandling: 'merge',
			});
		});
	});
});
