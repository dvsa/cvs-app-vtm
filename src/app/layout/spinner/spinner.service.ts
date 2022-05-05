import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { spinnerState, SpinnerState } from '@store/spinner/reducers/spinner.reducer';
import { Subject, combineLatest, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private store: Store) {
  }

  get showSpinner$(): Observable<boolean> {
    return this.store.pipe(select(spinnerState));
  }
}
