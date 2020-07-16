import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { getSelectedVehicleTestResultModel } from '@app/store/selectors/VehicleTestResultModel.selectors';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { TestResultModel } from '@app/models/test-result.model';
import {
  SetSelectedTestResultModelSuccess,
  SetTestViewState
} from '@app/store/actions/VehicleTestResultModel.actions';
import { VIEW_STATE } from '@app/app.enums';

@Injectable({ providedIn: 'root' })
export class TestResultGuard {
  constructor(private store: Store<IAppState>, private testResultService: TestResultService) {}

  hasSelectedTestResult(testResultId: string): Observable<boolean> {
    return this.store.pipe(
      select(getSelectedVehicleTestResultModel),
      map((testResult) => {
        return !!testResult ? testResultId === testResult.testResultId : !!testResult;
      })
    );
  }

  populateStoreWithDataFromApi(testResultId: string, systemNumber: string): Observable<boolean> {
    return this.testResultService.getTestResultById(systemNumber, testResultId).pipe(
      tap((testResult: TestResultModel) => {
        this.store.dispatch(new SetSelectedTestResultModelSuccess(testResult));
      }),
      map(Boolean),
      catchError((_) => {
        return of(false);
      })
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const currentState = !!route.queryParams ? VIEW_STATE.VIEW_ONLY : VIEW_STATE.EDIT;

    this.store.dispatch(new SetTestViewState(currentState));
    return this.hasSelectedTestResult(route.queryParams.testResultId).pipe(
      switchMap((inStore) => {
        if (inStore) {
          return of(inStore);
        }
        return this.populateStoreWithDataFromApi(
          route.queryParams.testResultId,
          route.queryParams.systemNumber
        );
      })
    );
  }
}
