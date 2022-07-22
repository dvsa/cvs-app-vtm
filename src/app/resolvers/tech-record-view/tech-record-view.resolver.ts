import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of, take, map, count } from 'rxjs';
import { State } from '@store/.';
import { Actions, ofType } from '@ngrx/effects';
import { selectRouteParam } from '@store/router/selectors/router.selectors';
import { getBySystemNumber, getBySystemNumberFailure } from '@store/technical-records';
import { fetchTestResultsBySystemNumber, fetchTestResultsBySystemNumberFailed, fetchTestResultsBySystemNumberSuccess } from '@store/test-records';
import { getBySystemNumberSuccess } from '@store/technical-records';

@Injectable({
  providedIn: 'root'
})
export class TechRecordViewResolver implements Resolve<boolean> {
  constructor(private store: Store<State>, private action$: Actions) {}
  resolve(): Observable<boolean> {
    this.store.pipe(select(selectRouteParam('systemNumber')), take(1)).subscribe(sn => {
      const systemNumber = sn || '';
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
