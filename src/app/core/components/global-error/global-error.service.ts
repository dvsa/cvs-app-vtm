import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '@store/.';
import { globalErrorState } from '@store/global-error/global-error-service.reducer';
import { addError, clearError, patchErrors, setErrors } from '@store/global-error/global-error.actions';
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

	focusAllControls() {
		document
			.querySelectorAll(`
      a[href]:not([tabindex='-1']),
      area[href]:not([tabindex='-1']),
      input:not([disabled]):not([tabindex='-1']),
      select:not([disabled]):not([tabindex='-1']),
      textarea:not([disabled]):not([tabindex='-1']),
      button:not([disabled]):not([tabindex='-1']),
      iframe:not([tabindex='-1']),
      [tabindex]:not([tabindex='-1']),
      [contentEditable=true]:not([tabindex='-1'])
    `)
			.forEach((element) => {
				if (element instanceof HTMLElement) {
					element.focus();
					element.blur();
				}
			});
	}
}
