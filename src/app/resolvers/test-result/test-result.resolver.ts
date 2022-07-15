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

  resolve(): Observable<boolean> {
    this.store.dispatch(fetchSelectedTestResult());
    return this.action$.pipe(
      ofType(fetchSelectedTestResultSuccess, fetchSelectedTestResultFailed),
      take(1),
      map(action => action.type === fetchSelectedTestResultSuccess.type)
    );
  }
}
