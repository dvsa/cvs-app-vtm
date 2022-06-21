import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { fetchSelectedTestResult, fetchSelectedTestResultFailed, fetchSelectedTestResultSuccess, selectedTestResultState } from '@store/test-records';
import { concatMap, map, mergeMap, Observable, of, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestResultResolver implements Resolve<boolean> {
  constructor(private store: Store<State>, private action$: Actions) {}

  /**
   * Fetch test result if it is not already in the store and resolve to true if it is or fetch was successful.
   * @param route
   * @param state
   * @returns true to resolve the route or false to block navigation
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.pipe(
      select(selectedTestResultState),
      take(1),
      concatMap((testResult) => of(!testResult ? true : false)),
      tap((dispatch) => {
        if (dispatch) {
          this.store.dispatch(fetchSelectedTestResult());
        }
      }),
      mergeMap((dispatch) => {
        return dispatch
          ? this.action$.pipe(
              ofType(fetchSelectedTestResultSuccess, fetchSelectedTestResultFailed),
              take(1),
              map((action) => (action.type === fetchSelectedTestResultSuccess.type ? true : false))
            )
          : of(true);
      })
    );
  }
}
