import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { getGlobalErrorState, globalErrorState } from '@store/global-error/reducers/global-error-service.reducer';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { addError, clearError } from '@store/global-error/actions/global-error.actions';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorService {

  private errors$: Observable<GlobalError[]>;

  constructor(private store: Store<State>) {
    this.errors$ = this.store.pipe(select(globalErrorState))
  }

  get errors() {
    return this.errors$;
  }

  addError(error: GlobalError){
    this.store.dispatch(addError(error))
  }

  clearError() : void {
    this.store.dispatch(clearError())
  }

}

export interface GlobalError {
  error: string;
  anchorLink?: string;
}
