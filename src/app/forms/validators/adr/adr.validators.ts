import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { CustomFormControl } from '@services/dynamic-forms/dynamic-form.types';

export class AdrValidators {
	static validateProductListRefNo = (control: CustomFormControl): ValidationErrors | null => {
		if (control.meta?.hide) {
			return null;
		}

		const unNumber1 = control.parent?.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo');

		// If either productListRefNo is empty, or the first unNumber, mark as invalid
		if ((!control.value && !unNumber1?.value) || (!control.value && !unNumber1?.value?.at(0))) {
			return { custom: { message: 'Reference number or UN number 1 is required when selecting Product List' } };
		}

		return null;
	};

	static validateProductListUNNumbers = (control: CustomFormControl): ValidationErrors | null => {
		if (control.meta?.hide) {
			return null;
		}

		const productListRefNo = control.parent?.get(
			'techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo'
		);
		const firstUnNumber = control.value?.at(0);
		const lastUnNumberIndex = (control.value?.length ?? 0) - 1;
		const lastUnNumber = control.value?.at(lastUnNumberIndex);

		// If either productListRefNo is empty, or the first unNumber, mark as invalid
		if ((!productListRefNo?.value && !control?.value) || (!productListRefNo?.value && !firstUnNumber)) {
			return {
				custom: {
					message: 'Reference number or UN number 1 is required when selecting Product List',
					anchorLink: 'UN_number_1',
				},
			};
		}

		// If there are more than 1 UN numbers, and the last UN number is empty, mark as invalid
		if (control.value?.length > 1 && !lastUnNumber) {
			return {
				custom: {
					message: `UN number ${lastUnNumberIndex + 1} is required or remove UN number ${lastUnNumberIndex + 1}`,
					anchorLink: `UN_number_${lastUnNumberIndex + 1}`,
				},
			};
		}

		// If any of the control indices have length greater than 1500 characters, show an error message for each
		if (control.value && control.value.some((unNumber: string) => unNumber.length > 1500)) {
			return {
				multiple: control.value
					.map((unNumber: string, index: number) =>
						unNumber.length > 1500
							? {
									error: `UN number ${index + 1} must be less than or equal to 1500 characters`,
									anchorLink: `UN_number_${index + 1}`,
								}
							: null
					)
					.filter(Boolean),
			};
		}

		return null;
	};

	/**
	 * Body declaration should only be visible when:
	 *  - Carries dangerous goods is true
	 *  - AND The ADR body type is one of the following:
	 *    > Rigid box body
	 *    > Full drawbar box body
	 *    > Centre axle box body
	 *    > Semi trailer box body
	 *  - AND The permitted dangerous good 'Explosive (type 3)' is selected
	 *
	 * @param control
	 */
	static setBodyDeclarationVisibility = (): ValidatorFn => {
		return (control: AbstractControl) => {
			const bodyDeclaration = control.parent?.get('techRecord_adrDetails_bodyDeclaration_type');

			if (bodyDeclaration instanceof CustomFormControl && bodyDeclaration.meta) {
				const carriesDangerousGoods = control.parent?.get('techRecord_adrDetails_dangerousGoods')?.value;
				const permittedDangerousGoods = control.parent?.get('techRecord_adrDetails_permittedDangerousGoods')?.value;
				const adrBodyType = control.parent?.get('techRecord_adrDetails_vehicleDetails_type')?.value;

				if (
					carriesDangerousGoods === true &&
					Array.isArray(permittedDangerousGoods) &&
					permittedDangerousGoods.includes(ADRDangerousGood.EXPLOSIVES_TYPE_3) &&
					(adrBodyType === ADRBodyType.RIGID_BOX_BODY ||
						adrBodyType === ADRBodyType.FULL_DRAWBAR_BOX_BODY ||
						adrBodyType === ADRBodyType.CENTRE_AXLE_BOX_BODY ||
						adrBodyType === ADRBodyType.SEMI_TRAILER_BOX_BODY)
				) {
					bodyDeclaration.meta.hide = false;
				} else {
					bodyDeclaration.meta.hide = true;
				}
			}

			return null;
		};
	};
}
