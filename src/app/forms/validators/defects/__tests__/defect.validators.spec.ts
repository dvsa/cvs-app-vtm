import { AbstractControl, FormGroup } from '@angular/forms';
import { deficiencyCategory } from '@models/defects/deficiency-category.enum';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { DefectValidators } from '../defect.validators';

describe('parent sibling validators', () => {
	let form: FormGroup;

	beforeEach(() => {
		form = new FormGroup({
			parent: new CustomFormGroup(
				{ name: 'parent', type: FormNodeTypes.GROUP },
				{ notes: new CustomFormControl({ name: 'notes', type: FormNodeTypes.CONTROL }) }
			),
			prohibitionIssued: new CustomFormControl({ name: 'prohibitionIssued', type: FormNodeTypes.CONTROL }),
			deficiencyCategory: new CustomFormControl({ name: 'deficiencyCategory', type: FormNodeTypes.CONTROL }),
			stdForProhibition: new CustomFormControl({ name: 'stdForProhibition', type: FormNodeTypes.CONTROL }),
		});
	});

	it('should return null', () => {
		expect(DefectValidators.validateDefectNotes(form.controls['foo'])).toBeNull();
	});

	it('should return error if deficiency category is dangerous* and prohibition issued is no and value of control is not defined', () => {
		const notes = form.get(['parent', 'notes']);
		const prohibitionIssued = form.get('prohibitionIssued');
		const defCategory = form.get('deficiencyCategory');
		const stdForProhibition = form.get('stdForProhibition');

		prohibitionIssued?.patchValue(false);
		defCategory?.patchValue(deficiencyCategory.Dangerous);
		stdForProhibition?.patchValue(true);

		expect(DefectValidators.validateDefectNotes(notes as AbstractControl)).toEqual({ validateDefectNotes: true });
	});

	it('should return null if deficiency category is dangerous* and prohibition issued is yes and value of control is not defined', () => {
		const notes = form.get(['parent', 'notes']);
		const prohibitionIssued = form.get('prohibitionIssued');
		const defCategory = form.get('deficiencyCategory');
		const stdForProhibition = form.get('stdForProhibition');

		prohibitionIssued?.patchValue(true);
		defCategory?.patchValue(deficiencyCategory.Dangerous);
		stdForProhibition?.patchValue(true);

		expect(DefectValidators.validateDefectNotes(notes as AbstractControl)).toBeNull();
	});

	it('should return null if deficiency category is not dangerous* and prohibition issued is yes and value of control is not defined', () => {
		const notes = form.get(['parent', 'notes']);
		const prohibitionIssued = form.get('prohibitionIssued');
		const defCategory = form.get('deficiencyCategory');

		prohibitionIssued?.patchValue(true);
		defCategory?.patchValue('foo');

		expect(DefectValidators.validateDefectNotes(notes as AbstractControl)).toBeNull();
	});

	it('should return null if deficiency category is not dangerous* and prohibition issued is no and value of control is not defined', () => {
		const notes = form.get(['parent', 'notes']);
		const prohibitionIssued = form.get('prohibitionIssued');
		const defCategory = form.get('deficiencyCategory');

		prohibitionIssued?.patchValue(false);
		defCategory?.patchValue('foo');

		expect(DefectValidators.validateDefectNotes(notes as AbstractControl)).toBeNull();
	});

	it('should return null if deficiency category is dangerous* and prohibition issued is no and value of control is defined', () => {
		const notes = form.get(['parent', 'notes']);
		const prohibitionIssued = form.get('prohibitionIssued');
		const defCategory = form.get('deficiencyCategory');
		const stdForProhibition = form.get('stdForProhibition');

		notes?.patchValue('foo');
		prohibitionIssued?.patchValue(false);
		defCategory?.patchValue(deficiencyCategory.Dangerous);
		stdForProhibition?.patchValue(true);

		expect(DefectValidators.validateDefectNotes(notes as AbstractControl)).toBeNull();
	});
});

describe('prohibition issued validator', () => {
	let form: FormGroup;

	beforeEach(() => {
		form = new FormGroup({
			prohibitionIssued: new CustomFormControl({ name: 'prohibitionIssued', type: FormNodeTypes.CONTROL }),
			deficiencyCategory: new CustomFormControl({ name: 'deficiencyCategory', type: FormNodeTypes.CONTROL }),
			stdForProhibition: new CustomFormControl({ name: 'stdForProhibition', type: FormNodeTypes.CONTROL }),
		});
	});

	it('should return null', () => {
		expect(DefectValidators.validateProhibitionIssued(form.controls['prohibitionIssued'])).toBeNull();
	});

	it('should return error when dangerous no asterisk and prohibition issued is false', () => {
		const defCategory = form.get('deficiencyCategory');
		const prohibitionIssued = form.get('prohibitionIssued');
		const stdForProhibition = form.get('stdForProhibition');

		defCategory?.patchValue(deficiencyCategory.Dangerous);
		prohibitionIssued?.patchValue(false);
		stdForProhibition?.patchValue(false);

		expect(DefectValidators.validateProhibitionIssued(form.controls['prohibitionIssued'])).toEqual({
			validateProhibitionIssued: true,
		});
	});

	it('should return null when prohibition issued is true', () => {
		const defCategory = form.get('deficiencyCategory');
		const prohibitionIssued = form.get('prohibitionIssued');
		const stdForProhibition = form.get('stdForProhibition');

		defCategory?.patchValue(deficiencyCategory.Dangerous);
		prohibitionIssued?.patchValue(true);
		stdForProhibition?.patchValue(false);

		expect(DefectValidators.validateProhibitionIssued(form.controls['prohibitionIssued'])).toBeNull();
	});

	it('should return null when std for prohibition is true', () => {
		const defCategory = form.get('deficiencyCategory');
		const prohibitionIssued = form.get('prohibitionIssued');
		const stdForProhibition = form.get('stdForProhibition');

		defCategory?.patchValue(deficiencyCategory.Dangerous);
		prohibitionIssued?.patchValue(false);
		stdForProhibition?.patchValue(true);

		expect(DefectValidators.validateProhibitionIssued(form.controls['prohibitionIssued'])).toBeNull();
	});

	it('should return null when deficiency category is not dangerous', () => {
		const defCategory = form.get('deficiencyCategory');
		const prohibitionIssued = form.get('prohibitionIssued');
		const stdForProhibition = form.get('stdForProhibition');

		defCategory?.patchValue(deficiencyCategory.Minor);
		prohibitionIssued?.patchValue(false);
		stdForProhibition?.patchValue(false);

		expect(DefectValidators.validateProhibitionIssued(form.controls['prohibitionIssued'])).toBeNull();
	});
});
