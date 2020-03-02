import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { INITIAL_STATE, Store } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { IAppState } from '@app/store/state/app.state';
import {TestStationsGuard} from '@app/test-record/guards/test-stations.guard';

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

  describe('canActivate', () => {
    it('should return true for preparers in state', () => {
      testResultService = { getTestStations: () => true };
      testStationsGuard = new TestStationsGuard(store, testResultService);
      expect(testStationsGuard.populateStoreWithDataFromApi).toBeTruthy();
      expect(testStationsGuard.hasTestStationsInStore).toBeTruthy();
      expect(testStationsGuard.canActivate()).toBeDefined();
    });
  });
});
