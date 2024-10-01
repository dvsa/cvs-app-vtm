import { Injectable, inject } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
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

	requiredWithBattery(message: string): ValidatorFn {
		return (control) => {
			if (control.parent && !control.value && this.adrService.canDisplayBatterySection(control.parent.value)) {
				return { required: message };
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
			if (control.parent) {
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

	requiresAUNNumberOrReferenceNumber(message: string): ValidatorFn {
		return (control) => {
			if (
				control.root?.value &&
				this.adrService.canDisplayTankStatementProductListSection(control.root.getRawValue())
			) {
				const refNo = control.root.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo');
				const unNos = control.root.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo');
				const unNosPopulated = unNos?.value && Array.isArray(unNos.value) && unNos.value.some((unNo) => !!unNo);
				if (!refNo?.value && !unNosPopulated) {
					return { required: message };
				}
			}

			return null;
		};
	}
}
