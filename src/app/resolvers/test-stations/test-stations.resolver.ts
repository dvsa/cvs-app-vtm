import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { fetchTestStations, fetchTestStationsFailed, fetchTestStationsSuccess } from '@store/test-stations';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestStationsResolver implements Resolve<boolean> {
  constructor(private store: Store<State>, private action$: Actions) {}

  resolve(): Observable<boolean> {
    this.store.dispatch(fetchTestStations());

    return this.action$.pipe(
      ofType(fetchTestStationsSuccess, fetchTestStationsFailed),
      take(1),
      map(action => action.type === fetchTestStationsSuccess.type)
    );
  }
}
