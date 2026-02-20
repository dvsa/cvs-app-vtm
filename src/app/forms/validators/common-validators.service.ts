import { Injectable, Signal, inject } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ReferenceDataResourceType, ReferenceDataTyre } from '@models/reference-data.model';
import { Store } from '@ngrx/store';
import { selectAllReferenceDataByResourceType } from '@store/reference-data';
import validateDate from 'validate-govuk-date';
import { GlobalError } from '../../core/components/global-error/global-error.interface';

@Injectable({ providedIn: 'root' })
export class CommonValidatorsService {
	store = inject(Store);

	isOneOf<T>(value: T, message: string, accordion?: string, anchorLink?: string): ValidatorFn {
		return (control) => {
			if (control.value && typeof value === 'object' && !Object.values(value as object).includes(control.value)) {
				const globalError = { oneOf: { error: message, anchorLink: '', accordion: '' } };
				if (anchorLink) {
					globalError.oneOf.anchorLink = anchorLink;
				}
				if (accordion) {
					globalError.oneOf.accordion = accordion;
				}
				return globalError;
			}

			return null;
		};
	}

	max(
		size: number,
		func: (control: AbstractControl) => GlobalError,
		suffix?: string,
		accordion?: string,
		anchorLink?: string
	): ValidatorFn;
	max(size: number, message: string, suffix?: string, accordion?: string, anchorLink?: string): ValidatorFn;
	max(
		size: number,
		message: string | ((control: AbstractControl) => GlobalError),
		suffix?: string,
		accordion?: string,
		anchorLink?: string
	): ValidatorFn {
		return (control) => {
			if (control.value && control.value > size) {
				suffix = suffix || '';
				if (typeof message !== 'string') {
					return { max: message(control) };
				}
				const globalError = {
					max: {
						error: `${message} must be less than or equal to ${size}${suffix}`,
						anchorLink: '',
						accordion: '',
					},
				};
				if (anchorLink) {
					globalError.max.anchorLink = anchorLink;
				}
				if (accordion) {
					globalError.max.accordion = accordion;
				}

				return globalError;
			}

			return null;
		};
	}

	min(
		size: number,
		func: (control: AbstractControl) => GlobalError,
		accordion?: string,
		anchorLink?: string
	): ValidatorFn;
	min(size: number, message: string, accordion?: string, anchorLink?: string): ValidatorFn;
	min(
		size: number,
		message: string | ((control: AbstractControl) => GlobalError),
		accordion?: string,
		anchorLink?: string
	): ValidatorFn {
		return (control) => {
			if (control.value && control.value < size) {
				if (typeof message !== 'string') {
					return { min: message(control) };
				}
				const globalError = {
					min: {
						error: `${message} must be greater than or equal to ${size}`,
						anchorLink: '',
						accordion: '',
					},
				};
				if (anchorLink) {
					globalError.min.anchorLink = anchorLink;
				}
				if (accordion) {
					globalError.min.accordion = accordion;
				}
				return globalError;
			}

			return null;
		};
	}

	minLength(
		length: number,
		func: (control: AbstractControl) => GlobalError,
		accordion?: string,
		anchorLink?: string
	): ValidatorFn;
	minLength(length: number, message: string, accordion?: string, anchorLink?: string): ValidatorFn;
	minLength(
		length: number,
		message: string | ((control: AbstractControl) => GlobalError),
		accordion?: string,
		anchorLink?: string
	): ValidatorFn {
		return (control) => {
			if (control.value && control.value.length < length) {
				if (typeof message !== 'string') {
					return { minLength: message(control) };
				}
				const globalError = {
					minLength: {
						error: `${message} must be at least ${length} characters`,
						anchorLink: '',
						accordion: '',
					},
				};
				if (anchorLink) {
					globalError.minLength.anchorLink = anchorLink;
				}
				if (accordion) {
					globalError.minLength.accordion = accordion;
				}
				return globalError;
			}

			return null;
		};
	}

	maxLength(
		length: number,
		func: (control: AbstractControl) => GlobalError,
		accordion?: string,
		anchorLink?: string
	): ValidatorFn;
	maxLength(length: number, message: string, accordion?: string, anchorLink?: string): ValidatorFn;
	maxLength(
		length: number,
		message: string | ((control: AbstractControl) => GlobalError),
		accordion?: string,
		anchorLink?: string
	): ValidatorFn {
		return (control) => {
			if (control.value && control.value.length > length) {
				if (typeof message !== 'string') {
					return { maxLength: message(control) };
				}
				const globalError = {
					maxLength: {
						error: `${message} must be less than or equal to ${length} characters`,
						anchorLink: '',
						accordion: '',
					},
				};
				if (anchorLink) {
					globalError.maxLength.anchorLink = anchorLink;
				}
				if (accordion) {
					globalError.maxLength.accordion = accordion;
				}
				return globalError;
			}

			return null;
		};
	}

	range(
		min: number,
		max: number,
		func: (control: AbstractControl) => GlobalError,
		accordion?: string,
		anchorLink?: string
	): ValidatorFn;
	range(min: number, max: number, message: string, accordion?: string, anchorLink?: string): ValidatorFn;
	range(
		min: number,
		max: number,
		message: string | ((control: AbstractControl) => GlobalError),
		accordion?: string,
		anchorLink?: string
	): ValidatorFn {
		return (control) => {
			if (!control.value) return null;
			if (!control.touched) return null;
			if (typeof control.value !== 'number') return null;

			if (control.value < min || control.value > max) {
				if (typeof message !== 'string') {
					return { range: message(control) };
				}
				const globalError = {
					range: { error: `${message} must be between ${min} and ${max}`, anchorLink: '', accordion: '' },
				};
				if (anchorLink) {
					globalError.range.anchorLink = anchorLink;
				}
				if (accordion) {
					globalError.range.accordion = accordion;
				}
				return globalError;
			}

			return null;
		};
	}

	pattern(
		pattern: string | RegExp,
		func: (control: AbstractControl) => GlobalError,
		accordion?: string,
		anchorLink?: string
	): ValidatorFn;
	pattern(pattern: string | RegExp, message: string, accordion?: string, anchorLink?: string): ValidatorFn;
	pattern(
		pattern: string | RegExp,
		message: string | ((control: AbstractControl) => GlobalError),
		accordion?: string,
		anchorLink?: string
	): ValidatorFn {
		return (control) => {
			if (control.value && !new RegExp(pattern).test(control.value)) {
				if (typeof message !== 'string') {
					return { pattern: message(control) };
				}
				const globalError = { pattern: { error: `${message}`, anchorLink: '', accordion: '' } };

				if (anchorLink) {
					globalError.pattern.anchorLink = anchorLink;
				}

				if (accordion) {
					globalError.pattern.accordion = accordion;
				}
				return globalError;
			}

			return null;
		};
	}

	antipattern(
		pattern: string | RegExp,
		func: (control: AbstractControl) => GlobalError,
		accordion?: string,
		anchorLink?: string
	): ValidatorFn;
	antipattern(pattern: string | RegExp, message: string, accordion?: string, anchorLink?: string): ValidatorFn;
	antipattern(
		pattern: string | RegExp,
		message: string | ((control: AbstractControl) => GlobalError),
		accordion?: string,
		anchorLink?: string
	): ValidatorFn {
		return (control) => {
			if (control.value && new RegExp(pattern).test(control.value)) {
				const globalError = { pattern: { error: message, anchorLink: '', accordion: '' } };

				if (anchorLink) {
					globalError.pattern.anchorLink = anchorLink;
				}

				if (accordion) {
					globalError.pattern.accordion = accordion;
				}
				return globalError;
			}

			return null;
		};
	}

	alphanumeric(
		message: string | ((control: AbstractControl) => GlobalError),
		accordion?: string,
		anchorLink?: string
	): ValidatorFn {
		return this.pattern('^[a-zA-Z0-9]*$', message as any, accordion, anchorLink);
	}

	pastDate(message: string, accordion?: string, anchorLink?: string): ValidatorFn {
		return (control) => {
			if (control.value && new Date(control.value) > new Date()) {
				const globalError = { pastDate: { error: `${message} must be in the past`, anchorLink: '', accordion: '' } };
				if (anchorLink) {
					globalError.pastDate.anchorLink = anchorLink;
				}
				if (accordion) {
					globalError.pastDate.accordion = accordion;
				}
				return globalError;
			}

			return null;
		};
	}

	pastOrCurrentYear(message: string, accordion?: string, anchorLink?: string): ValidatorFn {
		return (control) => {
			if (control.value && +control.value > new Date().getFullYear()) {
				const globalError = {
					pastOrCurrentYear: { error: `${message} must be the current or a past year`, anchorLink: '', accordion: '' },
				};
				if (anchorLink) {
					globalError.pastOrCurrentYear.anchorLink = anchorLink;
				}
				if (accordion) {
					globalError.pastOrCurrentYear.accordion = accordion;
				}
				return globalError;
			}

			return null;
		};
	}

	pastYear(message: string, accordion?: string, anchorLink?: string): ValidatorFn {
		return (control) => {
			if (control.value) {
				const currentYear = new Date().getFullYear();
				const inputYear = control.value;
				if (inputYear && inputYear > currentYear) {
					const globalError = { pastYear: { error: message, anchorLink: '', accordion: '' } };
					if (anchorLink) {
						globalError.pastYear.anchorLink = anchorLink;
					}
					if (accordion) {
						globalError.pastYear.accordion = accordion;
					}
					return { pastYear: message };
				}
			}
			return null;
		};
	}

	invalidDate(message: string, accordion?: string, anchorLink?: string): ValidatorFn {
		return (control) => {
			if (control.value && Number.isNaN(Date.parse(control.value))) {
				const globalError = { invalidDate: { error: message, anchorLink: '', accordion: '' } };
				if (anchorLink) {
					globalError.invalidDate.anchorLink = anchorLink;
				}
				if (accordion) {
					globalError.invalidDate.accordion = accordion;
				}
				return globalError;
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

	date(label: string, id?: string | ((control: AbstractControl) => string), accordion?: string): ValidatorFn {
		return (control) => {
			if (!control.value) return null;
			const [d] = (control.value as string).split('T');
			const [year, month, day] = d.split('-');
			const { error, errors } = validateDate(day || '', month || '', year || '', label);
			const anchorLink = typeof id === 'string' ? id : id?.(control) || label;

			if (error && errors?.length) {
				const globalError = { invalidDate: { error: errors[0].reason, anchorLink: '', accordion: '' } };
				if (id) {
					globalError.invalidDate.anchorLink = anchorLink;
				}
				if (accordion) {
					globalError.invalidDate.accordion = accordion;
				}
				return globalError;
			}

			if (year.length !== 4) {
				const globalError = {
					invalidDate: { error: `'${label || 'Date'}' year must be four digits`, anchorLink: '', accordion: '' },
				};
				if (id) {
					globalError.invalidDate.anchorLink = anchorLink;
				}
				if (accordion) {
					globalError.invalidDate.accordion = accordion;
				}
				return globalError;
			}

			return null;
		};
	}

	required(func: (control: AbstractControl) => GlobalError, accordion?: string, anchorLink?: string): ValidatorFn;
	required(message: string, accordion?: string, anchorLink?: string): ValidatorFn;
	required(
		message: string | ((control: AbstractControl) => GlobalError),
		accordion?: string,
		anchorLink?: string
	): ValidatorFn {
		return (control) => {
			if (control.parent && (!control.value || (Array.isArray(control.value) && control.value.length === 0))) {
				const globalError: GlobalError = { error: `${message} is required`, anchorLink: '', accordion: '' };

				if (typeof message !== 'string') {
					return { required: message(control) };
				}

				if (anchorLink) {
					globalError.anchorLink = anchorLink;
				}

				if (accordion) {
					globalError.accordion = accordion;
				}

				return { required: globalError };
			}

			return null;
		};
	}

	xYearsAfterCurrent(xYears: number, message: string, accordion?: string, anchorLink?: string): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const currentYear = new Date().getFullYear();
			const inputYear = control.value;
			const maxYear = currentYear + xYears;
			if (inputYear && (inputYear > maxYear || inputYear < 0)) {
				const globalError = {
					xYearsAfterCurrent: {
						error: `${message} must be equal to or before ${new Date().getFullYear() + xYears}`,
						anchorLink: '',
						accordion: '',
					},
				};
				if (accordion) {
					globalError.xYearsAfterCurrent.accordion = accordion;
				}
				if (anchorLink) {
					globalError.xYearsAfterCurrent.anchorLink = anchorLink;
				}
				return globalError;
			}

			return null;
		};
	}

	invalidOption(message: string, accordion = '', anchorLink = ''): ValidatorFn {
		return (control) =>
			control.value === '[INVALID_OPTION]' ? { invalidOption: { error: message, accordion, anchorLink } } : null;
	}

	doesTyresRefDataExist(
		refData: ReferenceDataResourceType,
		func: (control: AbstractControl) => GlobalError,
		accordion?: string,
		anchorLink?: string
	): ValidatorFn;
	doesTyresRefDataExist(
		refData: ReferenceDataResourceType,
		message: string,
		accordion?: string,
		anchorLink?: string
	): ValidatorFn;
	doesTyresRefDataExist(
		refData: ReferenceDataResourceType,
		message: string | ((control: AbstractControl) => GlobalError),
		accordion?: string,
		anchorLink?: string
	): ValidatorFn {
		return (control: AbstractControl) => {
			if (control.value) {
				const tyresRefData = this.store.selectSignal(selectAllReferenceDataByResourceType(refData)) as Signal<
					ReferenceDataTyre[]
				>;
				const refDataFound = tyresRefData()?.find((tyre) => tyre.code === String(control.value));
				if (!refDataFound) {
					if (typeof message !== 'string') {
						return { noAxleData: message(control) };
					}
					const globalError = { noAxleData: { error: `${message}`, anchorLink: '', accordion: '' } };
					if (anchorLink) {
						globalError.noAxleData.anchorLink = anchorLink;
					}
					if (accordion) {
						globalError.noAxleData.accordion = accordion;
					}
					return globalError;
				}
			}
			return null;
		};
	}
}
