import { Injectable } from '@angular/core';
import { ValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class CommonValidatorsService {
	max(size: number, message: string): ValidatorFn {
		return (control) => {
			if (control.value && control.value > size) {
				return { max: message };
			}

			return null;
		};
	}

	maxLength(length: number, message: string): ValidatorFn {
		return (control) => {
			if (control.value && control.value.length > length) {
				return { maxLength: message };
			}

			return null;
		};
	}

	pattern(pattern: string | RegExp, message: string): ValidatorFn {
		return (control) => {
			if (control.value && !new RegExp(pattern).test(control.value)) {
				return { pattern: message };
			}

			return null;
		};
	}

	pastDate(message: string): ValidatorFn {
		return (control) => {
			if (control.value && new Date(control.value) > new Date()) {
				return { pastDate: message };
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
}
