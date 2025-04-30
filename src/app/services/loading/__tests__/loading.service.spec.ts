import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SpinnerComponent } from '@core/components/spinner/spinner.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { getSpinner } from '@store/spinner/spinner.selectors';
import { technicalRecordsLoadingState } from '@store/technical-records';
import { testResultLoadingState } from '@store/test-records';
import { testStationsLoadingState } from '@store/test-stations';
import { selectTestTypesLoadingState } from '@store/test-types/test-types.selectors';
import { firstValueFrom, take } from 'rxjs';
import { LoadingService } from '../loading.service';

describe('Spinner-Service', () => {
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
			mockStore.resetSelectors();
		});

		it('Should return false when global spinner, testResult and technicalRecords loading state is false', async () => {
			mockStore.overrideSelector(getSpinner, false);
			mockStore.overrideSelector(testResultLoadingState, false);
			mockStore.overrideSelector(technicalRecordsLoadingState, false);
			expect(await firstValueFrom(service.showSpinner$.pipe(take(1)))).toBeFalsy();
		});

		it('Should return true when global spinner state is true', async () => {
			mockStore.overrideSelector(getSpinner, true);
			expect(await firstValueFrom(service.showSpinner$.pipe(take(1)))).toBeTruthy();
		});

		it('Should return true when testResult loading state is true', async () => {
			mockStore.overrideSelector(testResultLoadingState, true);
			expect(await firstValueFrom(service.showSpinner$.pipe(take(1)))).toBeTruthy();
		});

		it('Should return true when TechnicalRecords loading state is true', async () => {
			mockStore.overrideSelector(technicalRecordsLoadingState, true);
			expect(await firstValueFrom(service.showSpinner$.pipe(take(1)))).toBeTruthy();
		});

		it('Should return true when testTypes loading state is true', async () => {
			mockStore.overrideSelector(selectTestTypesLoadingState, true);
			expect(await firstValueFrom(service.showSpinner$.pipe(take(1)))).toBeTruthy();
		});

		it('Should return true when test stations loading state is true', async () => {
			mockStore.overrideSelector(testStationsLoadingState, true);
			expect(await firstValueFrom(service.showSpinner$.pipe(take(1)))).toBeTruthy();
		});
	});
});
