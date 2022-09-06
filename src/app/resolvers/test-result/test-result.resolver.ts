import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { fetchDefects, fetchDefectsFailed, fetchDefectsSuccess } from '@store/defects';
import { cancelEditingTestResult, fetchSelectedTestResult, fetchSelectedTestResultFailed, fetchSelectedTestResultSuccess } from '@store/test-records';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestResultResolver implements Resolve<boolean> {
  private readonly SUCCESS_COUNT = 3;
  constructor(private store: Store<State>, private action$: Actions) {}

  resolve(): Observable<boolean> {
    this.store.dispatch(fetchSelectedTestResult());
    this.store.dispatch(cancelEditingTestResult());

    return this.action$.pipe(
      ofType(fetchSelectedTestResultSuccess, fetchSelectedTestResultFailed),
      take(1),
      map(action => {
        return action.type === fetchSelectedTestResultSuccess.type;
      })
    );
  }
}
