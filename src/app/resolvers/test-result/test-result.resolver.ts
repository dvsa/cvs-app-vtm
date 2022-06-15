import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { fetchSelectedTestResult, fetchSelectedTestResultFailed, fetchSelectedTestResultSuccess } from '@store/test-records';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestResultResolver implements Resolve<boolean> {
  constructor(private store: Store<State>, private action$: Actions) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.store.dispatch(fetchSelectedTestResult());

    return this.action$.pipe(
      ofType(fetchSelectedTestResultSuccess, fetchSelectedTestResultFailed),
      take(1),
      map((action) => (action.type === fetchSelectedTestResultSuccess.type ? true : false))
    );
  }
}
