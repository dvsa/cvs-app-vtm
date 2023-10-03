import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { clearWarning, setWarnings } from '@store/global-warning/actions/global-warning.actions';
import { Observable } from 'rxjs';
import { globalWarningState } from '@store/global-warning/reducers/global-warning-service.reducers';
import { GlobalWarning } from './global-warning.interface';

@Injectable({
  providedIn: 'root',
})
export class GlobalWarningService {
  private warnings: Observable<GlobalWarning[]>;

  constructor(private store: Store<State>) {
    this.warnings = this.store.pipe(select(globalWarningState));
  }

  get warnings$() {
    return this.warnings;
  }

  setWarnings(warnings: GlobalWarning[]) {
    this.store.dispatch(setWarnings({ warnings }));
  }

  clearWarnings(): void {
    this.store.dispatch(clearWarning());
  }
}
