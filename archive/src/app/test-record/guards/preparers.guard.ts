import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, tap, switchMap, catchError, take } from 'rxjs/operators';

import { IAppState } from '@app/store/state/app.state';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { getPreparers } from '@app/store/selectors/ReferenceData.selectors';
import { LoadPreparersSuccess } from '@app/store/actions/ReferenceData.actions';
import { Preparer } from '@app/models/preparer';

@Injectable({ providedIn: 'root' })
export class PreparersGuard implements CanActivate {
  constructor(private store: Store<IAppState>, private testResultService: TestResultService) {}

  hasPreparers(): Observable<boolean> {
    return this.store.select(getPreparers).pipe(
      map((preparers) => {
        return !!preparers;
      }),
      take(1)
    );
  }

  populateStoreWithDataFromApi(): Observable<boolean> {
    return this.testResultService.getPreparers().pipe(
      tap((preparers: Preparer[]) => {
        this.store.dispatch(new LoadPreparersSuccess(preparers));
      }),
      map(Boolean),
      catchError((_) => {
        return of(false);
      })
    );
  }

  canActivate(): Observable<boolean> {
    return this.hasPreparers().pipe(
      switchMap((inStore) => {
        if (inStore) {
          return of(inStore);
        }
        return this.populateStoreWithDataFromApi();
      })
    );
  }
}
