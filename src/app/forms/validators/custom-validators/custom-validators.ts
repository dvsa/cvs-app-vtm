import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { VehicleClassDescription } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescription.enum.js';
import { VehicleSizes, VehicleTypes } from '@models/vehicle-tech-record.model';
// eslint-disable-next-line import/no-cycle
import { CustomFormControl, CustomFormGroup } from '@services/dynamic-forms/dynamic-form.types';
import validateDate from 'validate-govuk-date';

export class CustomValidators {
	static hideIfEmpty = (sibling: string): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control?.parent) {
				const siblingControl = control.parent.get(sibling) as CustomFormControl;
				siblingControl.meta.hide = !control.value;
			}

			return null;
		};
	};

	static hideIfEquals = (sibling: string, value: unknown): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control?.parent) {
				const siblingControl = control.parent.get(sibling) as CustomFormControl;
				siblingControl.meta.hide =
					Array.isArray(value) && control.value ? value.includes(control.value) : control.value === value;
			}

			return null;
		};
	};

	static hideIfNotEqual = (sibling: string, value: unknown): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control?.parent) {
				const siblingControl = control.parent.get(sibling) as CustomFormControl;
				siblingControl.meta.hide = Array.isArray(value) ? !value.includes(control.value) : control.value !== value;
			}

			return null;
		};
	};

	static enableIfEquals = (sibling: string, value: unknown): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control?.parent) {
				const siblingControl = control.parent.get(sibling) as CustomFormControl;
				const isEqual = Array.isArray(value) ? value.includes(control.value) : control.value === value;
				if (isEqual) {
					siblingControl.enable();
				} else {
					siblingControl.disable();
				}
			}
			return null;
		};
	};

	static disableIfEquals = (sibling: string, value: unknown): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control?.parent) {
				const siblingControl = control.parent.get(sibling) as CustomFormControl;
				const isEqual = Array.isArray(value) ? value.includes(control.value) : control.value === value;
				if (isEqual) {
					siblingControl.disable();
				} else {
					siblingControl.enable();
				}
			}
			return null;
		};
	};

	static hideIfParentSiblingNotEqual = (parentSibling: string, value: unknown): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control?.parent && control.parent.parent) {
				const siblingControl = control.parent.parent.get(parentSibling) as CustomFormControl;
				siblingControl.meta.hide = Array.isArray(value) ? !value.includes(control.value) : control.value !== value;
			}

			return null;
		};
	};

	static hideIfParentSiblingEquals = (parentSibling: string, value: unknown): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control && control.parent && control.parent.parent) {
				if ((control.parent as CustomFormControl | CustomFormGroup).meta?.hide) return null;
				if ((control.parent.parent as CustomFormControl | CustomFormGroup).meta?.hide) return null;
				const siblingControl = control.parent.parent.get(parentSibling) as CustomFormControl;
				siblingControl.meta.hide =
					Array.isArray(value) && control.value ? value.includes(control.value) : control.value === value;
			}

			return null;
		};
	};

	static requiredIfNotHidden =
		(): ValidatorFn =>
		(control: AbstractControl): ValidationErrors | null => {
			const customControl = control as CustomFormControl;
			if (!control?.parent) return null;
			if (customControl.meta.hide === false && !control.value) {
				// If meta.hide is false and control value is empty, return a validation error
				return { requiredIfNotHidden: customControl.meta.label };
			}
			return null;
		};

	static requiredIfEquals =
		(sibling: string, values: unknown[], customErrorMessage?: string): ValidatorFn =>
		(control: AbstractControl): ValidationErrors | null => {
			if (!control?.parent) return null;

			const siblingControl = control.parent.get(sibling) as CustomFormControl;
			const siblingValue = siblingControl.value;

			const isSiblingVisible = !siblingControl.meta.hide;

			const isSiblingValueIncluded = Array.isArray(siblingValue)
				? values.some((value) => siblingValue.includes(value))
				: values.includes(siblingValue);

			const isControlValueEmpty =
				control.value === null ||
				control.value === undefined ||
				control.value === '' ||
				(Array.isArray(control.value) && (control.value.length === 0 || control.value.every((val) => !val)));

			return isSiblingValueIncluded && isControlValueEmpty && isSiblingVisible
				? { requiredIfEquals: { sibling: siblingControl.meta.label, customErrorMessage } }
				: null;
		};

	static requiredIfAllEquals =
		(sibling: string, values: unknown[]): ValidatorFn =>
		(control: AbstractControl): ValidationErrors | null => {
			if (!control?.parent) return null;

			const siblingControl = control.parent.get(sibling) as CustomFormControl;
			const siblingValue = siblingControl.value;

			const isSiblingVisible = !siblingControl.meta.hide;

			const isSiblingValueIncluded = Array.isArray(siblingValue)
				? siblingValue.every((val) => values.includes(val))
				: values.includes(siblingValue);

			const isControlValueEmpty =
				control.value === null ||
				control.value === undefined ||
				control.value === '' ||
				(Array.isArray(control.value) && (control.value.length === 0 || control.value.every((val) => !val)));

			return isSiblingValueIncluded && isControlValueEmpty && isSiblingVisible
				? { requiredIfEquals: { sibling: siblingControl.meta.label } }
				: null;
		};

	static requiredIfNotEquals = (sibling: string, value: unknown): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control?.parent) {
				const siblingControl = control.parent.get(sibling) as CustomFormControl;
				const siblingValue = siblingControl.value;
				const newValue = Array.isArray(value) ? value.includes(siblingValue) : siblingValue === value;

				if (!newValue && (control.value === null || control.value === undefined || control.value === '')) {
					return { requiredIfNotEquals: { sibling: siblingControl.meta.label } };
				}
			}

			return null;
		};
	};

	static mustEqualSibling = (sibling: string): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control?.parent) {
				const siblingControl = control.parent.get(sibling) as CustomFormControl;
				const siblingValue = siblingControl.value;
				const isEqual = Array.isArray(control.value)
					? control.value.includes(siblingValue)
					: siblingValue === control.value;

				if (!isEqual) {
					return { mustEqualSibling: { sibling: siblingControl.meta.label } };
				}
			}

			return null;
		};
	};

	static validateVRMTrailerIdLength = (sibling: string): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!control.value) {
				return null;
			}

			if (control?.parent) {
				const siblingControl = control.parent.get(sibling) as CustomFormControl;
				const siblingValue = siblingControl.value;

				const isTrailerValueSelected = siblingValue === VehicleTypes.TRL;

				if (isTrailerValueSelected) {
					if (control.value.length < 7) {
						return {
							validateVRMTrailerIdLength: { message: 'Trailer ID must be greater than or equal to 7 characters' },
						};
					}
					if (control.value.length > 8) {
						return { validateVRMTrailerIdLength: { message: 'Trailer ID must be less than or equal to 8 characters' } };
					}
				} else {
					if (control.value.length < 1) {
						return { validateVRMTrailerIdLength: { message: 'VRM must be greater than or equal to 1 character' } };
					}
					if (control.value.length > 9) {
						return { validateVRMTrailerIdLength: { message: 'VRM must be less than or equal to 9 characters' } };
					}
				}
			}

			return null;
		};
	};

	static defined = (): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (typeof control.value === 'undefined') {
				return { defined: false };
			}
			return null;
		};
	};

	static validateVinCharacters() {
		return this.customPattern(['^(?!.*[OIQ]).*$', 'should not contain O, I or Q']);
	}
	static alphanumeric(): ValidatorFn {
		return this.customPattern(['^[a-zA-Z0-9]*$', 'must be alphanumeric']);
	}

	static numeric(): ValidatorFn {
		return this.customPattern(['^\\d*$', 'must be a whole number']);
	}

	static email(): ValidatorFn {
		return this.customPattern([
			"^[\\w\\-\\.\\+']+@([\\w-]+\\.)+[\\w-]{2,}$",
			'Enter an email address in the correct format, like name@example.com',
		]);
	}

	static customPattern([regEx, message]: string[]): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!control.value) {
				return null;
			}

			// eslint-disable-next-line security/detect-non-literal-regexp
			const valid = new RegExp(regEx).test(control.value);

			return valid ? null : { customPattern: { message } };
		};
	}

	static invalidOption: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
		return control.value === '[INVALID_OPTION]' ? { invalidOption: true } : null;
	};

	static dateIsInvalid: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
		if (control instanceof CustomFormControl && control.meta.hide) return null;
		const [yyyy, mm, dd] = (control.value ?? '').split('-');
		const label = control instanceof CustomFormControl ? control.meta.label : undefined;
		const checks = validateDate(
			Number.parseInt(dd ?? '', 10),
			Number.parseInt(mm ?? '', 10),
			Number.parseInt(yyyy ?? '', 10),
			label
		);
		return checks && checks.error ? { dateIsInvalid: { message: checks.errors?.[0]?.reason } } : null;
	};

	static pastDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
		const now = new Date();
		const date = control.value;

		if (date && new Date(date).getTime() > now.getTime()) {
			return { pastDate: true };
		}
		return null;
	};

	static futureDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
		const now = new Date();
		const date = control.value;
		if (date && new Date(date).getTime() < now.getTime()) {
			return { futureDate: true };
		}
		return null;
	};

	static pastYear: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
		const currentYear = new Date().getFullYear();
		const inputYear = control.value;
		if (inputYear && inputYear > currentYear) {
			return { pastYear: true };
		}
		return null;
	};

	static aheadOfDate = (sibling: string): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			const siblingControl = control?.parent?.get(sibling);
			if (siblingControl?.value && control.value && new Date(control.value) < new Date(siblingControl.value)) {
				return {
					aheadOfDate: {
						sibling: (siblingControl as CustomFormControl).meta.label,
						date: new Date(siblingControl.value),
					},
				};
			}

			return null;
		};
	};

	static dateNotExceed = (sibling: string, months: number): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			const siblingControl = control?.parent?.get(sibling);
			if (siblingControl?.value && control.value) {
				const maxDate = new Date(siblingControl.value);
				maxDate.setMonth(maxDate.getMonth() + months);

				if (new Date(control.value) > maxDate) {
					return { dateNotExceed: { sibling: (siblingControl as CustomFormControl).meta.label, months } };
				}
			}

			return null;
		};
	};

	/**
	 * Validator that copies control value to control of given name at the top-level ancestor of control.
	 * @param rootControlName - control in top-level ancestor of this control
	 * @returns null
	 */
	static copyValueToRootControl = (rootControlName: string): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			const rootControl = control.root.get(rootControlName);
			if (rootControl) {
				rootControl.setValue(control.value, { onlySelf: true, emitEvent: false });
			}
			return null;
		};
	};

	static notZNumber = (control: AbstractControl): ValidationErrors | null => {
		if (!control.value) return null;

		const isZNumber = /^[0-9]{7}[zZ]$/.test(control.value);

		return !isZNumber ? null : { notZNumber: true };
	};

	static handlePsvPassengersChange = (passengersOne: string, passengersTwo: string): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control.dirty) {
				const controlOne: number = control.root.get(passengersOne)?.value;
				const controlTwo: number = control.root.get(passengersTwo)?.value;
				const controlThree: number = control.value;

				const classControl = control.root.get('techRecord_vehicleClass_description');
				const sizeControl = control.root.get('techRecord_vehicleSize');

				const totalPassengers = controlOne + controlTwo + controlThree;

				switch (true) {
					case totalPassengers <= 22: {
						sizeControl?.setValue(VehicleSizes.SMALL, { emitEvent: false });
						classControl?.setValue(VehicleClassDescription.SmallPsvIeLessThanOrEqualTo22Seats, { emitEvent: false });
						break;
					}
					default: {
						sizeControl?.setValue(VehicleSizes.LARGE, { emitEvent: false });
						classControl?.setValue(VehicleClassDescription.LargePsvIeGreaterThan23Seats, { emitEvent: false });
					}
				}
				control.markAsPristine();
			}
			return null;
		};
	};

	static isMemberOfEnum = (
		checkEnum: Record<string, string>,
		options: Partial<EnumValidatorOptions> = {}
	): ValidatorFn => {
		options = { allowFalsy: false, ...options };

		return (control: AbstractControl): ValidationErrors | null => {
			if (options.allowFalsy && !control.value) return null;
			return Object.values(checkEnum).includes(control.value) ? null : { enum: true };
		};
	};

	static updateFunctionCode = (): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			const vehicleFunctionCode = control.root.get('techRecord_functionCode');
			const functionCodes: Record<string, string> = {
				rigid: 'R',
				articulated: 'A',
				'semi-trailer': 'A',
			};

			if (control.dirty) {
				vehicleFunctionCode?.setValue(functionCodes[control?.value], { emitEvent: false });
				control.markAsPristine();
			}
			return null;
		};
	};

	static modifyControlsByGroup = (
		control: AbstractControl,
		groups: string[],
		modifyFunc: (control: CustomFormControl) => void
	): void => {
		if ((control as CustomFormControl).meta.hide) return;

		const parentGroup = control.parent as CustomFormGroup;
		parentGroup.meta.children?.forEach((child) => {
			const childControl = parentGroup.get(child.name) as CustomFormControl;
			const childGroups = childControl?.meta.groups;
			childGroups?.forEach((group) => {
				if (groups.includes(group)) {
					modifyFunc(childControl);
				}
			});
		});
	};

	static setHidePropertyForGroups = (control: AbstractControl, groups: string[], hide: boolean): void => {
		this.modifyControlsByGroup(control, groups, (childControl) => {
			childControl.meta.hide = hide;
		});
	};

	static showGroupsWhenEqualTo = (values: unknown[] | undefined, groups: string[]): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (values && !values.includes(control.value)) return null;
			this.setHidePropertyForGroups(control, groups, false);

			return null;
		};
	};

	static showGroupsWhenIncludes = (values: unknown[] | undefined, groups: string[]): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (values && !values.some((value) => control.value?.includes(value))) return null;
			this.setHidePropertyForGroups(control, groups, false);
			return null;
		};
	};

	static hideGroupsWhenIncludes = (values: unknown[] | undefined, groups: string[]): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (values && values.some((value) => control.value?.includes(value))) {
				this.setHidePropertyForGroups(control, groups, true);
			}

			return null;
		};
	};

	static showGroupsWhenExcludes = (values: unknown[] | undefined, groups: string[]): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (values && values.some((value) => control.value?.includes(value))) return null;
			this.setHidePropertyForGroups(control, groups, false);

			return null;
		};
	};

	static hideGroupsWhenExcludes = (values: unknown[] | undefined, groups: string[]): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (values && values.some((value) => control.value?.includes(value))) return null;
			this.setHidePropertyForGroups(control, groups, true);

			return null;
		};
	};

	static hideGroupsWhenEqualTo = (values: unknown[] | undefined, groups: string[]): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (values && !values.includes(control.value)) return null;
			this.setHidePropertyForGroups(control, groups, true);

			return null;
		};
	};

	static addWarningForAdrField = (warning: string): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control instanceof CustomFormControl) {
				if (control.value) {
					control.meta.warning = undefined;
					return null;
				}

				if (control.dirty) {
					const { parent } = control;
					if (parent instanceof CustomFormGroup) {
						const touched = Object.values(parent.controls).some(
							(child) => child !== control && child.touched && child.value
						);
						if (touched) {
							control.meta.warning = warning;
						}
					}
				}
			}

			return null;
		};
	};

	static isArray = (options: Partial<IsArrayValidatorOptions> = {}) => {
		return (control: AbstractControl): ValidationErrors | null => {
			// Only perform subsequent logic if this condition is met, e.g. sibling control has value true
			if (options.whenEquals) {
				const { sibling, value } = options.whenEquals;
				const siblingControl = control.parent?.get(sibling);
				const siblingValue = siblingControl?.value;
				const isSiblingValueIncluded = Array.isArray(siblingValue)
					? value.some((v) => siblingValue.includes(v))
					: value.includes(siblingValue);

				if (!isSiblingValueIncluded) return null;
			}

			if (!Array.isArray(control.value)) return { isArray: 'must be a non-empty array' };

			if (options.ofType) {
				const index = control.value.findIndex((val) => typeof val !== options.ofType);
				return index === -1 ? null : { isArray: { message: `${index + 1} must be of type ${options.ofType}` } };
			}

			if (options.requiredIndices) {
				const index = control.value.findIndex((val, i) => options.requiredIndices?.includes(i) && !val);
				return index === -1 ? null : { isArray: { message: `${index + 1} is required` } };
			}

			return null;
		};
	};

	static custom = (func: (...args: unknown[]) => ValidationErrors | null, ...args: unknown[]) => {
		return (control: AbstractControl): ValidationErrors | null => func(control, ...args);
	};

	static tc3TestValidator = (args: { inspectionNumber: number }) => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (!control?.parent) return null;
			let areControlsEmpty: boolean[] = [];
			let inspection = '';
			// the inspection numbers for individual tests start form 1 so this checks if its an individual test or the control that contains the component
			if (args.inspectionNumber !== 0) {
				const tc3Type = control.parent?.get('tc3Type')?.value;
				const tc3PeriodicNumber = control.parent?.get('tc3PeriodicNumber')?.value;
				const tc3PeriodicExpiryDate = control.parent?.get('tc3PeriodicExpiryDate')?.value;
				// areTc3FieldsEmpty takes an array of tc3 test values and checks that at least one of the fields is filled out for each test
				areControlsEmpty = areTc3FieldsEmpty([{ tc3Type, tc3PeriodicExpiryDate, tc3PeriodicNumber }]);
				inspection = args.inspectionNumber as unknown as string;
				return areControlsEmpty.includes(true)
					? {
							tc3TestValidator: {
								message: `TC3 Subsequent inspection ${inspection} must have at least one populated field`,
							},
						}
					: null;
			}
			// this statement is the same logic but applied to the control that holds all of the tests.
			// This allows the error to be displayed in the Global error service
			if (!control.value) return null;
			areControlsEmpty = areTc3FieldsEmpty(control.value);
			areControlsEmpty.forEach((value, index) => {
				if (value) {
					if (inspection.length === 0) {
						inspection = `${index + 1}`;
					} else {
						inspection += `, ${index + 1}`;
					}
				}
			});
			return areControlsEmpty.includes(true)
				? {
						tc3TestValidator: {
							message: `TC3 Subsequent inspection ${inspection} must have at least one populated field`,
						},
					}
				: null;
		};
	};

	static minArrayLengthIfNotEmpty = (minimumLength: number, message: string): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control.value?.length && control.value.length < minimumLength) {
				return { minArrayLengthIfNotEmpty: { message } };
			}
			return null;
		};
	};

	static issueRequired = (): ValidatorFn => {
		return (control: AbstractControl): ValidationErrors | null => {
			const isPRS = control.parent?.value.testResult === 'prs';
			const isPass = control.parent?.value.testResult === 'pass';
			const issueRequired = control.parent?.value.centralDocs?.issueRequired;
			if ((isPRS || isPass) && issueRequired) {
				return null;
			}

			return CustomValidators.requiredIfEquals('testResult', ['pass'])(control);
		};
	};
}

export type EnumValidatorOptions = {
	allowFalsy: boolean;
};

export type IsArrayValidatorOptions = {
	ofType: string;
	requiredIndices: number[];
	whenEquals: { sibling: string; value: unknown[] };
};

const areTc3FieldsEmpty = (values: { tc3Type: string; tc3PeriodicNumber: string; tc3PeriodicExpiryDate: string }[]) => {
	const isValueEmpty: boolean[] = [];

	values.forEach((value) => {
		if (
			(value.tc3Type === null || value.tc3Type === undefined || value.tc3Type === '') &&
			(value.tc3PeriodicNumber === null || value.tc3PeriodicNumber === undefined || value.tc3PeriodicNumber === '') &&
			(value.tc3PeriodicExpiryDate === null ||
				value.tc3PeriodicExpiryDate === undefined ||
				value.tc3PeriodicExpiryDate === '')
		) {
			isValueEmpty.push(true);
		} else {
			isValueEmpty.push(false);
		}
	});
	return isValueEmpty;
};
