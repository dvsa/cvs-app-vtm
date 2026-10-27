import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SpinnerComponent } from '@core/components/spinner/spinner.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { defectsLoadingState } from '@store/defects';
import { State, initialAppState } from '@store/index';
import { referenceDataLoadingState } from '@store/reference-data';
import { requiredStandardsLoadingState } from '@store/required-standards/required-standards.selector';
import { getSpinner } from '@store/spinner/spinner.selectors';
import { selectTechRecordSearchLoadingState } from '@store/tech-record-search/tech-record-search.selector';
import { technicalRecordsLoadingState } from '@store/technical-records';
import { testResultLoadingState } from '@store/test-records';
import { testStationsLoadingState } from '@store/test-stations';
import { selectTestTypesLoadingState } from '@store/test-types/test-types.selectors';
import { firstValueFrom } from 'rxjs';
import { LoadingService } from '../loading.service';

describe('Spinner-Service', () => {
	const loadingSources = [
		{ name: 'global spinner', selector: getSpinner },
		{ name: 'test results', selector: testResultLoadingState },
		{ name: 'technical records', selector: technicalRecordsLoadingState },
		{ name: 'test types', selector: selectTestTypesLoadingState },
		{ name: 'test stations', selector: testStationsLoadingState },
		{ name: 'defects', selector: defectsLoadingState },
		{ name: 'reference data', selector: referenceDataLoadingState },
		{ name: 'technical record search', selector: selectTechRecordSearchLoadingState },
		{ name: 'required standards', selector: requiredStandardsLoadingState },
	];
	let service: LoadingService;
	let mockStore: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [SpinnerComponent],
			providers: [LoadingService, provideRouter([]), provideMockStore({ initialState: initialAppState })],
		});

		service = TestBed.inject(LoadingService);
		mockStore = TestBed.inject(MockStore);
	});

	it('should create the spinner service', () => {
		expect(service).toBeTruthy();
	});

	describe('showSpinner$', () => {
		beforeEach(() => {
			for (const { selector } of loadingSources) {
				mockStore.overrideSelector(selector, false);
			}
			mockStore.refreshState();
		});

		it('should return false when all loading sources are false', async () => {
			expect(await firstValueFrom(service.showSpinner$)).toBe(false);
		});

		it.each(loadingSources)('should return true when $name is loading', async ({ selector }) => {
			mockStore.overrideSelector(selector, true);
			mockStore.refreshState();

			expect(await firstValueFrom(service.showSpinner$)).toBe(true);
		});
	});
});
