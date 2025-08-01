import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { VehicleTypes } from '../../models/vehicle-tech-record.model';

@Injectable({
	providedIn: 'root',
})
export class TechRecordValidatorsService {
	validateVRMTrailerIdLength(sibling: string): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!control.value) {
				return null;
			}

			if (control?.parent) {
				const siblingControl = control.parent.get(sibling);
				const siblingValue = siblingControl?.value;

				const isTrailerValueSelected = siblingValue === VehicleTypes.TRL;

				if (isTrailerValueSelected) {
					if (control.value.length < 7) {
						return {
							validateVRMTrailerIdLength: {
								error: 'Trailer ID must be greater than or equal to 7 characters',
								anchorLink: 'input-vrm-or-trailer-id',
							},
						};
					}
					if (control.value.length > 8) {
						return {
							validateVRMTrailerIdLength: {
								error: 'Trailer ID must be less than or equal to 8 characters',
								anchorLink: 'input-vrm-or-trailer-id',
							},
						};
					}
				} else {
					if (control.value.length < 1) {
						return {
							validateVRMTrailerIdLength: {
								error: 'VRM must be greater than or equal to 1 character',
								anchorLink: 'input-vrm-or-trailer-id',
							},
						};
					}
					if (control.value.length > 9) {
						return {
							validateVRMTrailerIdLength: {
								error: 'VRM must be less than or equal to 9 characters',
								anchorLink: 'input-vrm-or-trailer-id',
							},
						};
					}
				}
			}

			return null;
		};
	}
}
