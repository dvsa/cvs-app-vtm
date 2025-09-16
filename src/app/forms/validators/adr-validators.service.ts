import { Injectable, inject } from '@angular/core';
import { FormArray, ValidatorFn } from '@angular/forms';
import { AdrService } from '@services/adr/adr.service';
import _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class AdrValidatorsService {
	adrService = inject(AdrService);

	requiredWithDangerousGoods(message: string): ValidatorFn {
		return (control) => {
			if (
				control.parent &&
				(!control.value || (Array.isArray(control.value) && control.value.length === 0)) &&
				this.adrService.canDisplayDangerousGoodsSection(control.parent.value)
			) {
				return { required: message };
			}

			return null;
		};
	}

	requiredWithExplosives(message: string): ValidatorFn {
		return (control) => {
			if (
				control.parent &&
				!control.value &&
				this.adrService.canDisplayCompatibilityGroupJSection(control.parent.value)
			) {
				return { required: message };
			}

			return null;
		};
	}

	requiredWithBattery(message: string, allowFalse = false): ValidatorFn {
		return (control) => {
			if (control.parent && this.adrService.canDisplayBatterySection(control.parent.value)) {
				if (allowFalse && control.value === false) {
					return null;
				}

				if (!control.value) {
					return { required: message };
				}
			}

			return null;
		};
	}

	requiredWithTankOrBattery(message: string): ValidatorFn {
		return (control) => {
			if (control.parent && !control.value && this.adrService.canDisplayTankOrBatterySection(control.parent.value)) {
				return { required: message };
			}

			return null;
		};
	}

	requiredWithTankStatement(message: string): ValidatorFn {
		return (control) => {
			if (
				control.parent &&
				!control.value &&
				this.adrService.canDisplayTankStatementSelectSection(control.parent.value)
			) {
				return { required: message };
			}

			return null;
		};
	}

	requiredWithBrakeEndurance(message: string): ValidatorFn {
		return (control) => {
			if (control.parent && !control.value && this.adrService.canDisplayWeightSection(control.parent.value)) {
				return { required: message };
			}

			return null;
		};
	}

	requiredWithBatteryListApplicable(message: string): ValidatorFn {
		return (control) => {
			if (
				control.parent &&
				!control.value &&
				this.adrService.canDisplayBatteryListNumberSection(control.parent.value)
			) {
				return { required: message };
			}

			return null;
		};
	}

	requiresOnePopulatedTC3Field(message: string): ValidatorFn {
		return (control) => {
			if (control.parent && this.adrService.canDisplayTankOrBatterySection(control.root.value)) {
				const tc3InspectionType = control.parent.get('tc3Type');
				const tc3PeriodicNumber = control.parent.get('tc3PeriodicNumber');
				const tc3ExpiryDate = control.parent.get('tc3PeriodicExpiryDate');
				const allFieldsEmpty = !tc3InspectionType?.value && !tc3PeriodicNumber?.value && !tc3ExpiryDate?.value;

				if (allFieldsEmpty) {
					return { required: message };
				}
				if (!allFieldsEmpty) {
					[tc3InspectionType, tc3PeriodicNumber, tc3ExpiryDate].map((ctrl) => ctrl?.setErrors(null));
				}
			}

			return null;
		};
	}

	requiresAllUnNumbersToBePopulated(): ValidatorFn {
		return (control) => {
			if (control.parent && this.adrService.canDisplayTankStatementProductListSection(control.parent.value)) {
				const unNumbersArray = control as FormArray;
				const unNumbers = unNumbersArray?.value;
				if (Array.isArray(unNumbers)) {
					const index = unNumbers.findIndex((unNumber) => !unNumber);
					const control = unNumbersArray?.controls[index];
					if (control) {
						const errors = control.errors || {};
						control.setErrors({
							...errors,
							required: {
								error: `UN number ${index + 1} is required or remove UN number ${index + 1}`,
								anchorLink: `techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo-${index + 1}`,
							},
						});

						return {
							required: {
								error: `UN number ${index + 1} is required or remove UN number ${index + 1}`,
								anchorLink: `techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo-${index + 1}`,
							},
						};
					}
				}
			}

			return null;
		};
	}

	requiresAUnNumberOrReferenceNumber(message: string): ValidatorFn {
		return (control) => {
			if (control.parent && this.adrService.canDisplayTankStatementProductListSection(control.parent.value)) {
				const refNo = control.parent.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo');
				const unNumbers = control.parent.get(
					'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo'
				) as FormArray;

				if (!refNo) return null;
				if (!unNumbers) return null;

				// If reference number and the first UN number are both empty, then show the error
				if (!refNo.value && Array.isArray(unNumbers.value) && !unNumbers.value[0]) {
					const refNoErrors = refNo.errors || {};
					const unNumbersErrors = unNumbers.controls[0].errors || {};

					// Set errors on both simulatenously
					refNo.setErrors({ ...refNoErrors, required: message });

					unNumbers.controls[0].setErrors({
						...unNumbersErrors,
						required: {
							error: message,
							anchorLink: 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo-1',
						},
					});

					return { required: message };
				}

				// If reference number or the first UN number are populated, and the control is valid, then clear required error
				const { required: refNoRequired, ...otherRefNoErrors } = refNo.errors || {};
				refNo.setErrors(_.isEmpty(otherRefNoErrors) ? null : otherRefNoErrors);

				const { required: unNumberRequired, ...otherUNNumberErrors } = unNumbers.controls[0].errors || {};
				unNumbers.controls[0].setErrors(_.isEmpty(otherUNNumberErrors) ? null : otherUNNumberErrors);
			}

			return null;
		};
	}
}
