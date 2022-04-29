import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { spinnerState, SpinnerState } from '@store/spinner/reducers/spinner.reducer';
import { Subject, combineLatest, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private readonly _destroying$ = new Subject<void>();

  constructor(private store: Store) {
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }

  get showSpinner$(): Observable<boolean> {
    return this.store.pipe(select(spinnerState));
  }
}
