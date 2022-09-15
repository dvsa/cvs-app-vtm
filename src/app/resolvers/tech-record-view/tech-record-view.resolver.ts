import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { getBySystemNumber, getBySystemNumberFailure, getBySystemNumberSuccess } from '@store/technical-records';
import { fetchTestResultsBySystemNumber, fetchTestResultsBySystemNumberFailed, fetchTestResultsBySystemNumberSuccess } from '@store/test-records';
import { count, map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechRecordViewResolver implements Resolve<boolean> {
  constructor(private store: Store<State>, private action$: Actions) {}
  resolve(): Observable<boolean> {
    this.store.pipe(select(selectRouteNestedParams), take(1)).subscribe(({ systemNumber }) => {
      this.store.dispatch(getBySystemNumber({ systemNumber }));
      this.store.dispatch(fetchTestResultsBySystemNumber({ systemNumber }));
    });

    return this.action$.pipe(
      ofType(getBySystemNumberSuccess, fetchTestResultsBySystemNumberSuccess, getBySystemNumberFailure, fetchTestResultsBySystemNumberFailed),
      take(2),
      count(action => action.type === getBySystemNumberSuccess.type || action.type === fetchTestResultsBySystemNumberSuccess.type),
      map(count => (count === 2 ? true : false))
    );
  }
}
