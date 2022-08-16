import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { cancelEditingTestResult, fetchSelectedTestResult, fetchSelectedTestResultFailed, fetchSelectedTestResultSuccess } from '@store/test-records';
import { fetchTestTypes, fetchTestTypesFailed, fetchTestTypesSuccess } from '@store/test-types/actions/test-types.actions';
import { count, filter, map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestResultResolver implements Resolve<boolean> {
  constructor(private store: Store<State>, private action$: Actions) {}

  resolve(): Observable<boolean> {
    this.store.dispatch(fetchSelectedTestResult());
    this.store.dispatch(fetchTestTypes());
    this.store.dispatch(cancelEditingTestResult());

    return this.action$.pipe(
      ofType(fetchSelectedTestResultSuccess, fetchSelectedTestResultFailed, fetchTestTypesSuccess, fetchTestTypesFailed),
      take(2),
      filter(action => action.type === fetchSelectedTestResultSuccess.type || action.type === fetchTestTypesSuccess.type),
      count(),
      map(count => {
        return count === 2;
      })
    );
  }
}
