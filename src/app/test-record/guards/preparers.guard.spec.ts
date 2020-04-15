import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { INITIAL_STATE, Store } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { PreparersGuard } from '@app/test-record/guards/preparers.guard';
import { IAppState } from '@app/store/state/app.state';
import {Preparer} from '@app/models/preparer';

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

  describe('should check the store and populate it with preparers data', () => {
    testResultService = { getPreparers: () => [{} as Preparer] };
    preparersGuard = new PreparersGuard(store, testResultService);

    it('should return true for preparers in store', () => {
      expect(preparersGuard.canActivate).toBeTruthy();
    });

    it('should return true for preparers in store', () => {
      expect(preparersGuard.hasPreparers).toBeTruthy();
    });

    it('should dispatch the action to populate store with preparers', () => {
      expect(preparersGuard.populateStoreWithDataFromApi).toBeTruthy();
    });
  });

});
