import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { globalErrorState } from '@store/global-error/reducers/global-error-service.reducer';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorService {
  private errors_ = new BehaviorSubject<GlobalError[]>([]);
  errors$: Observable<GlobalError[]>;

  constructor(private store: Store<State>) {
    this.errors$ = combineLatest([this.errors_.asObservable(), this.store.select(globalErrorState)]).pipe(
      map(([errors, err]) => {
        const combinedErrors: GlobalError[] = [...errors];
        if (err) {
          combinedErrors.push({ message: err, anchorLink: '' } as GlobalError);
        }
        return combinedErrors;
      })
    );
  }

  set errors(errors: GlobalError[]) {
    this.errors_.next([...errors]);
  }

  get errors() {
    return this.errors_.getValue();
  }

  addError(error: GlobalError) {
    this.errors_.next([...this.errors, error]);
  }
}

export interface GlobalError {
  message: string;
  anchorLink: string;
}
