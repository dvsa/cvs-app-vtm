import { Injectable, Signal, inject } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ReferenceDataResourceType, ReferenceDataTyre } from '@models/reference-data.model';
import { Store } from '@ngrx/store';
import { selectAllReferenceDataByResourceType } from '@store/reference-data';
import dayjs from 'dayjs';
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
		suffix?: string,
		accordion?: string,
		anchorLink?: string
	): ValidatorFn;
	min(size: number, message: string, suffix?: string, accordion?: string, anchorLink?: string): ValidatorFn;
	min(
		size: number,
		message: string | ((control: AbstractControl) => GlobalError),
		suffix?: string,
		accordion?: string,
		anchorLink?: string
	): ValidatorFn {
		return (control) => {
			if (control.value != null && control.value < size) {
				suffix = suffix || '';
				if (typeof message !== 'string') {
					return { min: message(control) };
				}
				const globalError = {
					min: {
						error: `${message} must be greater than or equal to ${size}${suffix}`,
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
			if (!control.value && control.value !== 0) return null;
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
			// Determine past date (ignore seconds)
			if (control.value && dayjs(control.value).startOf('minute').isAfter(dayjs().endOf('minute'))) {
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

	pastOrCurrentDate(message: string, accordion?: string, anchorLink?: string): ValidatorFn {
		return (control) => {
			if (!control.value) return null;

			// Normalize the date so it only checks calendar date
			const today = dayjs().startOf('day');
			const input = dayjs(control.value).startOf('day');

			if (input.isAfter(today)) {
				return {
					pastOrCurrentDate: { error: `${message} must be today or in the past`, anchorLink, accordion },
				};
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

	datetime({
		label,
		anchorLink = '',
		accordion = '',
	}: { label: string; anchorLink?: string; accordion?: string }): ValidatorFn {
		return (control) => {
			if (!control.value) return null;

			const [d, t] = control.value.split('T');
			const [year, month, day] = d.split('-');
			const { errors } = validateDate(day || '', month || '', year || '', label);

			if (errors?.length) {
				return { datetime: { error: errors[0].reason, anchorLink, accordion } };
			}

			if (year.length !== 4) {
				return { datetime: { error: `'${label}' year must be four digits`, anchorLink, accordion } };
			}

			if (!t) {
				return { datetime: { error: `'${label}' must include time`, anchorLink, accordion } };
			}

			const [hh, mm] = t.split(':');
			const hours = Number.parseInt(hh, 10);
			const minutes = Number.parseInt(mm, 10);

			if (Number.isNaN(hours) || Number.isNaN(minutes)) {
				return { datetime: { error: `'${label}' must include time`, anchorLink, accordion } };
			}

			if (hours > 23) {
				return { datetime: { error: `'${label}' hours must be between 0 and 23`, anchorLink, accordion } };
			}

			if (minutes > 59) {
				return { datetime: { error: `'${label}' minutes must be between 0 and 59`, anchorLink, accordion } };
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
			if (!control.parent) return null;

			// If array has an element it satisfies the required condition
			if (Array.isArray(control.value) && control.value.length > 0) return null;

			// If the value is truthy or 0 it satisfies the required condition
			if (typeof control.value === 'number' || !!control.value) return null;

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

	applyWhen(condition: (control: AbstractControl) => boolean, ...validators: ValidatorFn[]): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!control.parent) return null;

			const validator = Validators.compose(validators);

			if (condition(control) && validator) {
				return validator(control);
			}

			return null;
		};
	}

	isAfterDate(
		sibling: string,
		label: string,
		siblingLabel: string,
		accordion?: string,
		anchorLink?: string
	): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!control.parent) return null;

			if (!control.value) return null;
			const inputValue = dayjs(control.value);
			if (!inputValue.isValid()) return null;

			// Only perform comparison if both controls contain valid dates
			const siblingControl = control.parent.get(sibling) as AbstractControl;
			if (!siblingControl.value || !siblingControl.valid) return null;
			const siblingValue = dayjs(siblingControl.value);
			if (!siblingValue.isValid()) return null;

			// If dates are the same, return null
			if (inputValue.isSame(siblingValue)) return null;

			return inputValue.isAfter(siblingValue)
				? null
				: {
						aheadOfDate: {
							error: `${label} must be ahead of ${siblingLabel} (${siblingValue.format('DD/MM/YYYY')})`,
							anchorLink,
							accordion,
						},
					};
		};
	}

	isBeforeDate(
		sibling: string,
		label: string,
		siblingLabel: string,
		accordion?: string,
		anchorLink?: string
	): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!control.parent) return null;

			const inputValue = control.value;
			if (!inputValue) return null;

			// Only perform comparison if both controls contain valid dates
			const siblingControl = control.parent.get(sibling) as AbstractControl;
			const siblingValue = siblingControl.value;
			if (!siblingValue) return null;

			// If dates are the same, return null
			if (dayjs(inputValue).isSame(dayjs(siblingValue))) return null;

			return dayjs(inputValue).isBefore(dayjs(siblingValue))
				? null
				: {
						beforeDate: {
							error: `${label} must be before ${siblingLabel} (${dayjs(siblingValue).format('DD/MM/YYYY')})`,
							anchorLink,
							accordion,
						},
					};
		};
	}
}
