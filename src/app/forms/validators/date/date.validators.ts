import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import validateDate from 'validate-govuk-date';

export class DateValidators {
	static validDate(displayTime = false, label?: string): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!control.value) {
				return null;
			}

			const [d, t] = (control.value as string).split('T');
			const [year, month, day] = d.split('-');
			const { error, errors } = validateDate(day || '', month || '', year || '', label);

			if (error && errors?.length) {
				return { invalidDate: errors[0] };
			}

			if (year.length !== 4) {
				return { invalidDate: { error: true, reason: `'${label || 'Date'}' year must be four digits` } };
			}

			if (displayTime) {
				return this.validateTime(t, label);
			}

			return null;
		};
	}

	private static validateTime(time: string, label: string | undefined) {
		const [hours, minutes] = time.split(':');

		if (!hours || !minutes) {
			return { invalidDate: { error: true, reason: `'${label || 'Date'}' must include time` } };
		}
		if (Number.parseInt(hours, 10) > 23) {
			return { invalidDate: { error: true, reason: `'${label || 'Date'}' hours must be between 0 and 23` } };
		}
		if (Number.parseInt(minutes, 10) > 59) {
			return { invalidDate: { error: true, reason: `'${label || 'Date'}' minutes must be between 0 and 59` } };
		}

		return null;
	}
}
