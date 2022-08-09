import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { getSpinner } from '@store/spinner/selectors/spinner.selectors';
import { technicalRecordsLoadingState } from '@store/technical-records';
import { testResultLoadingState } from '@store/test-records';
import { firstValueFrom, take } from 'rxjs';
import { SpinnerComponent } from './spinner.component';
import { SpinnerService } from './spinner.service';

describe('Spinner-Service', () => {
  let service: SpinnerService;
  let mockStore: MockStore<State>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [SpinnerComponent],
      imports: [RouterTestingModule],
      providers: [SpinnerService, provideMockStore({ initialState: initialAppState })]
    });

    service = TestBed.inject(SpinnerService);
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
  });
});
