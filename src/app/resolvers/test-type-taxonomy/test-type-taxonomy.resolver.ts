import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { fetchTestTypes, fetchTestTypesFailed, fetchTestTypesSuccess } from '@store/test-types/actions/test-types.actions';
import { count, filter, map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestTypeTaxonomyResolver implements Resolve<boolean> {
  private readonly SUCCESS_COUNT = 1;
  constructor(private store: Store<State>, private action$: Actions) {}

  resolve(): Observable<boolean> {
    this.store.dispatch(fetchTestTypes());

    return this.action$.pipe(
      ofType(fetchTestTypesSuccess, fetchTestTypesFailed),
      take(this.SUCCESS_COUNT),
      filter(action => action.type === fetchTestTypesSuccess.type),
      count(),
      map(count => {
        return count === this.SUCCESS_COUNT;
      })
    );
  }
}
