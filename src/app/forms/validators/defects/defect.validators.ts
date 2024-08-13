import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { deficiencyCategory } from '@models/defects/deficiency-category.enum';

export class DefectValidators {
	static validateDefectNotes: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
		if (control?.parent && control.parent.parent) {
			const grandParent = control.parent.parent;
			const defCategory = grandParent?.get('deficiencyCategory')?.value as deficiencyCategory;
			const prohibitionIssued = grandParent.get('prohibitionIssued')?.value as boolean;
			const stdForProhibition = grandParent.get('stdForProhibition')?.value as boolean;

			const imNumber: string = grandParent.get('imNumber')?.value ? `${grandParent.get('imNumber')?.value}.` : '';
			const itemNumber: string = grandParent.get('itemNumber')?.value ? `${grandParent.get('itemNumber')?.value}.` : '';
			const deficiencyId: string = grandParent.get('deficiencyId')?.value
				? `${grandParent.get('deficiencyId')?.value}.`
				: '';
			const deficiencySubId: string = grandParent.get('deficiencySubId')?.value ?? '';

			const defectType = imNumber + itemNumber + deficiencyId + deficiencySubId;

			const optionalDefectNotes = ['43.1.a.ii', '41.1.a.ii', '10.1.iii'];

			if (optionalDefectNotes.includes(defectType)) return null;

			if (
				!control.value &&
				(defCategory === deficiencyCategory.Advisory ||
					(defCategory === deficiencyCategory.Dangerous && stdForProhibition && !prohibitionIssued))
			) {
				return { validateDefectNotes: true };
			}
		}
		return null;
	};

	static validateProhibitionIssued: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
		if (control?.parent) {
			const defCategory = control.parent.get('deficiencyCategory')?.value as deficiencyCategory;
			const stdForProhibition = control.parent.get('stdForProhibition')?.value as boolean;
			const prohibitionIssued = control.value as boolean;

			if (defCategory === deficiencyCategory.Dangerous && !stdForProhibition && !prohibitionIssued) {
				return { validateProhibitionIssued: true };
			}
		}
		return null;
	};
}
