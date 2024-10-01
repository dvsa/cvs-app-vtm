import { Injectable } from '@angular/core';
import { FormArray, FormGroup, ValidationErrors } from '@angular/forms';
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

	extractErrors = (form: FormGroup | FormArray) => {
		const errors: ValidationErrors = {};
		Object.values(form.controls).forEach((control) => {
			if (control instanceof FormGroup || control instanceof FormArray) {
				this.extractErrors(control);
			} else if (control.invalid && control.errors) {
				Object.entries(control.errors).forEach(([key, error]) => {
					errors[key] = error;
				});
			}
		});

		return errors;
	};

	extractGlobalErrors = (form: FormGroup | FormArray) => {
		const errors: GlobalError[] = [];
		Object.entries(form.controls).forEach(([key, control]) => {
			control.updateValueAndValidity();
			if (control instanceof FormGroup || control instanceof FormArray) {
				errors.push(...this.extractGlobalErrors(control));
			} else if (control.invalid && control.errors) {
				Object.values(control.errors).forEach((error) => {
					errors.push({ error, anchorLink: key });
				});
			}
		});

		return errors;
	};
}
