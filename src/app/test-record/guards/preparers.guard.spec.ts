import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MockStore } from '@app/utils';
import { BehaviorSubject } from 'rxjs';
import { cold } from 'jasmine-marbles';

import { TestResultService } from '@app/technical-record-search/test-result.service';
import { PreparersGuard } from '@app/test-record/guards/preparers.guard';
import { Preparer } from '@app/models/preparer';
import { LoadPreparersSuccess } from '@app/store/actions/ReferenceData.actions';

describe('PreparersGuard', () => {
  let preparersGuard: PreparersGuard;
  let getPreparers: jest.Mock;
  const mockSelector = new BehaviorSubject<any>(undefined);
  const store: MockStore = new MockStore(mockSelector);

  beforeEach(async(() => {
    getPreparers = jest.fn();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        PreparersGuard,
        {
          provide: Store,
          useValue: store
        },
        {
          provide: TestResultService,
          useValue: { getPreparers }
        }
      ]
    }).compileComponents();

    preparersGuard = TestBed.get(PreparersGuard);
    spyOn(store, 'dispatch');
  }));

  describe('PreparersGuard', () => {
    it('should get preparers from the store', () => {
      const preparer = { preparerId: 'test', preparerName: 'test' } as Preparer;
      const getPreparers$ = cold('(-a|)', { a: [preparer] });
      getPreparers.mockReturnValue(getPreparers$);

      store.dispatch(new LoadPreparersSuccess([preparer]));

      const expected$ = cold('(a|)', { a: true });
      const activate$ = preparersGuard.canActivate();

      expect(getPreparers).not.toHaveBeenCalled();
      expect(activate$).toBeObservable(expected$);
    });

    it('should load the Prepares from the API', () => {
      const preparer = { preparerId: 'test', preparerName: 'test' } as Preparer;
      const getPreparers$ = cold('--(a|)', { a: [preparer] });
      getPreparers.mockReturnValue(getPreparers$);

      store.dispatch(new LoadPreparersSuccess(null));

      const expected$ = cold('--(a|)', { a: true });
      const activate$ = preparersGuard.canActivate();

      expect(store.dispatch).toHaveBeenCalled();
      expect(activate$).toBeObservable(expected$);
    });

    it('rejects after API throws an error', () => {
      const preparersData$ = cold('---#');
      getPreparers.mockReturnValue(preparersData$);

      const expected$ = cold('---(a|)', { a: false });
      const activate$ = preparersGuard.canActivate();

      expect(activate$).toBeObservable(expected$);
    });
  });
});
