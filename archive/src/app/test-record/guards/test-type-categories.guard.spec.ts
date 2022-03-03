import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MockStore } from '@app/utils';
import { BehaviorSubject } from 'rxjs';
import { cold } from 'jasmine-marbles';

import { TestResultService } from '@app/technical-record-search/test-result.service';
import { TestTypeCategoriesGuard } from '@app/test-record/guards/test-type-categories.guard';
import { TestTypeCategory } from '@app/models/test-type-category';
import { LoadTestTypeCategoriesSuccess } from '@app/store/actions/ReferenceData.actions';

describe('TestTypesCategoriesGuard', () => {
  let testTypeCategoriesGuard: TestTypeCategoriesGuard;
  let getTestTypeCategories: jest.Mock;
  const mockSelector = new BehaviorSubject<any>(undefined);
  const store: MockStore = new MockStore(mockSelector);

  beforeEach(async(() => {
    getTestTypeCategories = jest.fn();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        TestTypeCategoriesGuard,
        {
          provide: Store,
          useValue: store
        },
        {
          provide: TestResultService,
          useValue: { getTestTypeCategories }
        }
      ]
    }).compileComponents();

    testTypeCategoriesGuard = TestBed.get(TestTypeCategoriesGuard);
    spyOn(store, 'dispatch');
  }));

  describe('TestTypeCategoriesGuard', () => {
    it('should get test type categories from the store', () => {
      const testTypeCategory = { testTypeName: 'test' } as TestTypeCategory;
      const getTestTypeCategories$ = cold('(-a|)', { a: [testTypeCategory] });
      getTestTypeCategories.mockReturnValue(getTestTypeCategories$);

      store.dispatch(new LoadTestTypeCategoriesSuccess([testTypeCategory]));

      const expected$ = cold('(a|)', { a: true });
      const activate$ = testTypeCategoriesGuard.canActivate();

      expect(getTestTypeCategories).not.toHaveBeenCalled();
      expect(activate$).toBeObservable(expected$);
    });

    it('should load the test type categories from the API', () => {
      const testTypeCategory = { testTypeName: 'test' } as TestTypeCategory;
      const getTestTypeCategories$ = cold('--(a|)', { a: [testTypeCategory] });
      getTestTypeCategories.mockReturnValue(getTestTypeCategories$);

      store.dispatch(new LoadTestTypeCategoriesSuccess(null));

      const expected$ = cold('--(a|)', { a: true });
      const activate$ = testTypeCategoriesGuard.canActivate();

      expect(store.dispatch).toHaveBeenCalled();
      expect(activate$).toBeObservable(expected$);
    });

    it('rejects after API throws an error', () => {
      const testTypeCategoryData$ = cold('---#');
      getTestTypeCategories.mockReturnValue(testTypeCategoryData$);

      const expected$ = cold('---(a|)', { a: false });
      const activate$ = testTypeCategoriesGuard.canActivate();

      expect(activate$).toBeObservable(expected$);
    });
  });
});
