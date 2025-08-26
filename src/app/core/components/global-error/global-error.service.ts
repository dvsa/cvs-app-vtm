import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { globalErrorState } from '@store/global-error/global-error-service.reducer';
import { addError, clearError, patchErrors, setErrors } from '@store/global-error/global-error.actions';
import { GlobalError } from './global-error.interface';

@Injectable({
	providedIn: 'root',
})
export class GlobalErrorService {
	store = inject(Store);

	errors$ = this.store.pipe(select(globalErrorState));

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

	extractErrors = (control: AbstractControl) => {
		const errors: ValidationErrors = {};

		if (control instanceof FormControl) {
			Object.entries(control.errors || {}).forEach(([key, error]) => {
				errors[key] = error;
			});

			return errors;
		}

		if (control instanceof FormGroup || control instanceof FormArray) {
			Object.values(control.controls).forEach((control) => {
				if (control instanceof FormGroup || control instanceof FormArray) {
					this.extractErrors(control);
				} else if (control.invalid && control.errors) {
					Object.entries(control.errors).forEach(([key, error]) => {
						errors[key] = error;
					});
				}
			});
		}

		return errors;
	};

	extractGlobalErrors = (form: FormGroup | FormArray) => {
		const errors: GlobalError[] = [];

		// For each control in the form, determine its validity and collect form errors
		Object.entries(form.controls).forEach(([key, control]) => {
			control.updateValueAndValidity();

			// For nested form groups/arrays, collect the top level errors, then recusively collect errors from their children
			if (control instanceof FormGroup || control instanceof FormArray) {
				if (control.invalid && control.errors) {
					Object.values(control.errors).forEach((error) => {
						errors.push({
							error: typeof error === 'string' ? error : error.error,
							anchorLink: typeof error === 'string' ? key : error.anchorLink,
						});
					});
				}

				errors.push(...this.extractGlobalErrors(control));
			} else if (control.invalid && control.errors) {
				Object.values(control.errors).forEach((error) => {
					errors.push({
						error: typeof error === 'string' ? error : error.error,
						anchorLink: typeof error === 'string' ? key : error.anchorLink,
					});
				});
			}
		});

		return errors;
	};

	extractGlobalErrorsFromErrorResponse(e: HttpErrorResponse) {
		const errors: GlobalError[] = [];

		if (e.status === 400) {
			if (typeof e.error === 'string') {
				errors.push({
					error: e.error,
				});

				return errors;
			}

			if ('error' in e.error) {
				const field = e.error.error.match(/"([^"]+)"/);
				errors.push({
					error: e.error.error,
					anchorLink: field && field.length > 1 ? field[1].replace(/"/g, '') : '',
				});

				return errors;
			}

			if ('errors' in e.error && Array.isArray(e.error.errors)) {
				e.error.errors.forEach((error: string) => {
					const field = error.match(/"([^"]+)"/);
					errors.push({
						error,
						anchorLink: field && field.length > 1 ? field[1].replace(/"/g, '') : '',
					});
				});

				return errors;
			}
		} else if (e.status === 502) {
			errors.push({
				error: 'Internal Server Error, please contact technical support',
				anchorLink: '',
			});
		}

		return errors;
	}
}
