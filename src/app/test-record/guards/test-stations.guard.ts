import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';

import { IAppState } from '@app/store/state/app.state';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { TestStation } from '@app/models/test-station';
import { getTestStations } from '@app/store/selectors/ReferenceData.selectors';
import { LoadTestStationsSuccess } from '@app/store/actions/ReferenceData.actions';

@Injectable({ providedIn: 'root' })
export class TestStationsGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store<IAppState>,
    private testResultService: TestResultService
  ) {}

  hasTestStationsInStore(): Observable<boolean> {
    return this.store.pipe(
      select(getTestStations),
      map((testStations) => {
        return !!testStations;
      })
    );
  }

  populateStoreWithDataFromApi(): Observable<boolean> {
    return this.testResultService.getTestStations().pipe(
      tap((testStations: TestStation[]) => {
        this.store.dispatch(new LoadTestStationsSuccess(testStations));
      }),
      map(Boolean),
      catchError((error) => {
        return of(false);
      })
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.hasTestStationsInStore().pipe(
      switchMap((inStore) => {
        if (inStore) {
          return of(inStore);
        }
        return this.populateStoreWithDataFromApi();
      })
    );
  }
}
