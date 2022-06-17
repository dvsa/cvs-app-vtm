import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { fetchSelectedTestResult, fetchSelectedTestResultFailed, fetchSelectedTestResultSuccess, selectedTestResultState } from '@store/test-records';
import { firstValueFrom, from, map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestResultResolver implements Resolve<boolean> {
  constructor(private store: Store<State>, private action$: Actions) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const testResult = await firstValueFrom(this.store.pipe(select(selectedTestResultState)));
    if (!testResult) {
      this.store.dispatch(fetchSelectedTestResult());
    } else {
      return Promise.resolve(true);
    }

    return firstValueFrom(
      this.action$.pipe(
        ofType(fetchSelectedTestResultSuccess, fetchSelectedTestResultFailed),
        take(1),
        map((action) => (action.type === fetchSelectedTestResultSuccess.type ? true : false))
      )
    );
  }
}
