import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import {
  addError, clearError, patchErrors, setErrors,
} from '@store/global-error/actions/global-error.actions';
import { globalErrorState } from '@store/global-error/reducers/global-error-service.reducer';
import { Observable } from 'rxjs';
import { GlobalError } from './global-error.interface';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorService {
  private errors: Observable<GlobalError[]>;

  constructor(private store: Store<State>) {
    this.errors = this.store.pipe(select(globalErrorState));
  }

  get errors$() {
    return this.errors;
  }

  addError(error: GlobalError) {
    this.store.dispatch(addError(error));
  }

  setErrors(errors: GlobalError[]) {
    this.store.dispatch(setErrors({ errors }));
  }

  patchErrors(errors: GlobalError[]) {
    this.store.dispatch(patchErrors({ errors }));
  }

  clearErrors(): void {
    this.store.dispatch(clearError());
  }
}
