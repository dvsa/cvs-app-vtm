import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { GlobalErrorState } from '@store/global-error/reducers/global-error-service.reducer';
import { getErrorMessage } from '@store/global-error/selectors/global-error.selectors';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorService {
  constructor(private store: Store<GlobalErrorState>) {}

  get globalError() {
    return this.store.pipe(select(getErrorMessage));
  }
}
