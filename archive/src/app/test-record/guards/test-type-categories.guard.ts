import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

import { IAppState } from '@app/store/state/app.state';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { TestTypeCategory } from '@app/models/test-type-category';
import { LoadTestTypeCategoriesSuccess } from '@app/store/actions/ReferenceData.actions';
import { getTestTypeCategories } from '@app/store/selectors/ReferenceData.selectors';

@Injectable({
  providedIn: 'root'
})
export class TestTypeCategoriesGuard implements CanActivate {
  constructor(private store: Store<IAppState>, private testResultService: TestResultService) {}

  hasTestTypeCategories(): Observable<boolean> {
    return this.store.select(getTestTypeCategories).pipe(
      map((testTypesCategories) => {
        return !!testTypesCategories;
      }),
      take(1)
    );
  }

  populateStoreWithDataFromApi(): Observable<boolean> {
    return this.testResultService.getTestTypeCategories().pipe(
      tap((testTypesCategories: TestTypeCategory[]) => {
        this.store.dispatch(new LoadTestTypeCategoriesSuccess(testTypesCategories));
      }),
      map(Boolean),
      catchError((_) => {
        return of(false);
      })
    );
  }

  canActivate(): Observable<boolean> {
    return this.hasTestTypeCategories().pipe(
      switchMap((inStore) => {
        if (inStore) {
          return of(inStore);
        }
        return this.populateStoreWithDataFromApi();
      })
    );
  }
}
