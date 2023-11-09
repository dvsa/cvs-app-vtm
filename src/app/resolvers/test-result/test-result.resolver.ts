import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import {
  cancelEditingTestResult,
  fetchSelectedTestResult,
  fetchSelectedTestResultFailed,
  fetchSelectedTestResultSuccess,
} from '@store/test-records';
import { map, take } from 'rxjs';

export const testResultResolver: ResolveFn<boolean> = () => {
  const store: Store<State> = inject(Store<State>);
  const action$: Actions = inject(Actions);
  store.dispatch(fetchSelectedTestResult());
  store.dispatch(cancelEditingTestResult());

  return action$.pipe(
    ofType(fetchSelectedTestResultSuccess, fetchSelectedTestResultFailed),
    take(1),
    map((action) => {
      return action.type === fetchSelectedTestResultSuccess.type;
    }),
  );
};
