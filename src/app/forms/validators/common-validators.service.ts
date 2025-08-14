import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import validateDate from 'validate-govuk-date';
import { GlobalError } from '../../core/components/global-error/global-error.interface';

@Injectable({ providedIn: 'root' })
export class CommonValidatorsService {
	isOneOf<T>(value: T, message: string): ValidatorFn {
		return (control) => {
			if (control.value && typeof value === 'object' && !Object.values(value as object).includes(control.value)) {
				return { oneOf: message };
			}

			return null;
		};
	}

	max(size: number, func: (control: AbstractControl) => GlobalError): ValidatorFn;
	max(size: number, message: string): ValidatorFn;
	max(size: number, message: string | ((control: AbstractControl) => GlobalError)): ValidatorFn {
		return (control) => {
			if (control.value && control.value > size) {
				return { max: typeof message === 'string' ? message : message(control) };
			}

			return null;
		};
	}

	min(size: number, func: (control: AbstractControl) => GlobalError): ValidatorFn;
	min(size: number, message: string): ValidatorFn;
	min(size: number, message: string | ((control: AbstractControl) => GlobalError)): ValidatorFn {
		return (control) => {
			if (control.value && control.value < size) {
				return { min: typeof message === 'string' ? message : message(control) };
			}

			return null;
		};
	}

	minLength(length: number, func: (control: AbstractControl) => GlobalError): ValidatorFn;
	minLength(length: number, message: string): ValidatorFn;
	minLength(length: number, message: string | ((control: AbstractControl) => GlobalError)): ValidatorFn {
		return (control) => {
			if (control.value && control.value.length < length) {
				return { minLength: typeof message === 'string' ? message : message(control) };
			}

			return null;
		};
	}

	maxLength(length: number, func: (control: AbstractControl) => GlobalError): ValidatorFn;
	maxLength(length: number, message: string): ValidatorFn;
	maxLength(length: number, message: string | ((control: AbstractControl) => GlobalError)): ValidatorFn {
		return (control) => {
			if (control.value && control.value.length > length) {
				return { maxLength: typeof message === 'string' ? message : message(control) };
			}

			return null;
		};
	}

	pattern(pattern: string | RegExp, func: (control: AbstractControl) => GlobalError): ValidatorFn;
	pattern(pattern: string | RegExp, message: string): ValidatorFn;
	pattern(pattern: string | RegExp, message: string | ((control: AbstractControl) => GlobalError)): ValidatorFn {
		return (control) => {
			if (control.value && !new RegExp(pattern).test(control.value)) {
				return { pattern: typeof message === 'string' ? message : message(control) };
			}

			return null;
		};
	}

	antipattern(pattern: string | RegExp, func: (control: AbstractControl) => GlobalError): ValidatorFn;
	antipattern(pattern: string | RegExp, message: string): ValidatorFn;
	antipattern(pattern: string | RegExp, message: string | ((control: AbstractControl) => GlobalError)): ValidatorFn {
		return (control) => {
			if (control.value && new RegExp(pattern).test(control.value)) {
				return { pattern: message };
			}

			return null;
		};
	}

	alphanumeric(message: string | ((control: AbstractControl) => GlobalError)): ValidatorFn {
		return this.pattern('^[a-zA-Z0-9]*$', message as any);
	}

	pastDate(message: string): ValidatorFn {
		return (control) => {
			if (control.value && new Date(control.value) > new Date()) {
				return { pastDate: message };
			}

			return null;
		};
	}

	pastOrCurrentYear(message: string): ValidatorFn {
		return (control) => {
			if (control.value && +control.value > new Date().getFullYear()) {
				return { pastOrCurrentYear: message };
			}

			return null;
		};
	}

	pastYear(message: string): ValidatorFn {
		return (control) => {
			if (control.value) {
				const currentYear = new Date().getFullYear();
				const inputYear = control.value;
				if (inputYear && inputYear > currentYear) {
					return { pastYear: message };
				}
			}
			return null;
		};
	}

	invalidDate(message: string): ValidatorFn {
		return (control) => {
			if (control.value && Number.isNaN(Date.parse(control.value))) {
				return { invalidDate: message };
			}

			return null;
		};
	}

	_date(label: string): ValidatorFn {
		return (control) => {
			if (!control.value) return null;

			const parts = (control.value || '').split('-');

			const years = Number.parseInt(parts[0]);
			const months = Number.parseInt(parts[1]);
			const days = Number.parseInt(parts[2]);
			const errors = validateDate(days, months, years, label);

			if (errors.error) {
				// Only validate the day/month/year element if it has a value
				const sortedErrors = errors.errors?.sort((a, b) => a.index - b.index);

				if (sortedErrors?.[0].index === 0) {
					return { date: sortedErrors[0].reason };
				}

				if (sortedErrors?.[0].index === 1) {
					return { date: sortedErrors[0].reason };
				}

				if (sortedErrors?.[0].index === 2) {
					return { date: sortedErrors[0].reason };
				}
			}

			return null;
		};
	}

	date(label: string): ValidatorFn {
		return (control) => {
			if (!control.value) return null;
			const [d] = (control.value as string).split('T');
			const [year, month, day] = d.split('-');
			const { error, errors } = validateDate(day || '', month || '', year || '', label);

			if (error && errors?.length) {
				return { invalidDate: errors[0].reason };
			}

			if (year.length !== 4) {
				return { invalidDate: `'${label || 'Date'}' year must be four digits` };
			}

			return null;
		};
	}

	required(func: (control: AbstractControl) => GlobalError): ValidatorFn;
	required(message: string): ValidatorFn;
	required(message: string | ((control: AbstractControl) => GlobalError)): ValidatorFn {
		return (control) => {
			if (control.parent && (!control.value || (Array.isArray(control.value) && control.value.length === 0))) {
				return { required: typeof message === 'string' ? message : message(control) };
			}

			return null;
		};
	}

	xYearsAfterCurrent(xYears: number, message: string): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const currentYear = new Date().getFullYear();
			const inputYear = control.value;
			const maxYear = currentYear + xYears;
			if (inputYear && (inputYear > maxYear || inputYear < 0)) {
				return { xYearsAfterCurrent: message };
			}

			return null;
		};
	}

	invalidOption(message: string): ValidatorFn {
		return (control) => (control.value === '[INVALID_OPTION]' ? { invalidOption: message } : null);
	}
}
