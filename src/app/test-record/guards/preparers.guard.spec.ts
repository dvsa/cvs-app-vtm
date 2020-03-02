import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { INITIAL_STATE, Store } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { PreparersGuard } from '@app/test-record/guards/preparers.guard';
import { IAppState } from '@app/store/state/app.state';

describe('PreparersGuard', () => {
  let preparersGuard: PreparersGuard;
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
      testResultService = { getPreparers: () => true };
      preparersGuard = new PreparersGuard(store, testResultService);
      expect(preparersGuard.populateStoreWithDataFromApi).toBeTruthy();
      expect(preparersGuard.hasPreparers).toBeTruthy();
      expect(preparersGuard.canActivate()).toBeDefined();
    });
  });
});
