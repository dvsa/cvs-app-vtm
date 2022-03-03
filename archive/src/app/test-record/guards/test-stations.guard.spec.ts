import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { INITIAL_STATE, Store } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { IAppState } from '@app/store/state/app.state';
import { TestStationsGuard } from '@app/test-record/guards/test-stations.guard';
import { TestStation } from '@app/models/test-station';

describe('TestStationsGuard', () => {
  let testStationsGuard: TestStationsGuard;
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

  describe('should check the store and populate it with test stations data', () => {
    testResultService = { getTestStations: () => [{} as TestStation] };
    testStationsGuard = new TestStationsGuard(store, testResultService);

    it('should return true if test stations data is in store', () => {
      expect(testStationsGuard.canActivate).toBeTruthy();
    });

    it('should return true for test stations in store', () => {
      expect(testStationsGuard.hasTestStationsInStore).toBeTruthy();
    });

    it('should dispatch the action to populate store with test stations', () => {
      expect(testStationsGuard.populateStoreWithDataFromApi).toBeTruthy();
    });
  });
});
