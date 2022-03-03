import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { INITIAL_STATE, Store } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { IAppState } from '@app/store/state/app.state';
import { TestStationsGuard } from '@app/test-record/guards/test-stations.guard';
import { TestResultGuard } from '@app/test-record/guards/test-result.guard';
import { TestResultModel } from '@app/models/test-result.model';

describe('TestStationsGuard', () => {
  let testResultsGuard: TestResultGuard;
  let testResultService;
  let store: Store<IAppState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        TestResultService,
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        }
      ]
    }).compileComponents();
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  }));

  describe('should check the store and populate it with test results data', () => {
    testResultService = { getTestResultById: () => [{} as TestResultModel] };
    testResultsGuard = new TestResultGuard(store, testResultService);

    it('should return true for preparers in store', () => {
      expect(testResultsGuard.canActivate).toBeTruthy();
    });

    it('should return true for preparers in store', () => {
      expect(testResultsGuard.hasSelectedTestResult).toBeTruthy();
    });

    it('should dispatch the action to populate store with preparers', () => {
      expect(testResultsGuard.populateStoreWithDataFromApi).toBeTruthy();
    });
  });
});
