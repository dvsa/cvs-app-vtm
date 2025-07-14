import { Injectable, inject } from '@angular/core';
import { FormArray, ValidatorFn } from '@angular/forms';
import { AdrService } from '@services/adr/adr.service';

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
				const tc3ExpiryDate = control.parent.get('tc3ExpiryDate');
				if (!tc3InspectionType?.value && !tc3PeriodicNumber?.value && !tc3ExpiryDate?.value) {
					return { required: message };
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
					if (index > -1) {
						unNumbersArray?.controls[index].setErrors({
							required: `UN number ${index + 1} is required or remove UN number ${index + 1}`,
						});
						return { required: `UN number ${index + 1} is required or remove UN number ${index + 1}` };
					}
					unNumbersArray?.controls[0].setErrors(null);
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
				if (!refNo?.value && Array.isArray(unNumbers?.value) && !unNumbers?.value[0]) {
					// Set errors on both simulatenously
					refNo?.setErrors({ required: message });
					unNumbers?.controls[0].setErrors({ required: message });

					return { required: message };
				}

				// Clear errors from both fields if either is populated
				refNo?.setErrors(null);
				unNumbers?.controls[0].setErrors(null);
			}

			return null;
		};
	}
}
