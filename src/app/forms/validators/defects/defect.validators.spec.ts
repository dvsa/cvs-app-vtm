import { FormGroup, AbstractControl } from '@angular/forms';
import { CustomFormGroup, FormNodeTypes, CustomFormControl } from '@forms/services/dynamic-form.types';
import { DefectValidators } from './defect.validators';

describe('parent sibling validators', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup({
      parent: new CustomFormGroup(
        { name: 'parent', type: FormNodeTypes.GROUP },
        { notes: new CustomFormControl({ name: 'notes', type: FormNodeTypes.CONTROL }) }
      ),
      prohibitionIssued: new CustomFormControl({ name: 'prohibitionIssued', type: FormNodeTypes.CONTROL }),
      deficiencyCategory: new CustomFormControl({ name: 'deficiencyCategory', type: FormNodeTypes.CONTROL })
    });
  });

  it('should return null', () => {
    expect(DefectValidators.validateDefectNotes(form.controls['foo'] as AbstractControl)).toBeNull();
  });

  it('should return error if deficiency category is dangerous* and prohibition issued is no and value of control is not defined', () => {
    const notes = form.get(['parent', 'notes']);
    const prohibitionIssued = form.get('prohibitionIssued');
    const deficiencyCategory = form.get('deficiencyCategory');
    prohibitionIssued?.patchValue(false);
    deficiencyCategory?.patchValue('dangerous*');
    expect(DefectValidators.validateDefectNotes(notes as AbstractControl)).toEqual({ validateDefectNotes: true });
  });

  it('should return null if deficiency category is dangerous* and prohibition issued is yes and value of control is not defined', () => {
    const notes = form.get(['parent', 'notes']);
    const prohibitionIssued = form.get('prohibitionIssued');
    const deficiencyCategory = form.get('deficiencyCategory');
    prohibitionIssued?.patchValue(true);
    deficiencyCategory?.patchValue('dangerous*');
    expect(DefectValidators.validateDefectNotes(notes as AbstractControl)).toBeNull();
  });

  it('should return null if deficiency category is not dangerous* and prohibition issued is yes and value of control is not defined', () => {
    const notes = form.get(['parent', 'notes']);
    const prohibitionIssued = form.get('prohibitionIssued');
    const deficiencyCategory = form.get('deficiencyCategory');
    prohibitionIssued?.patchValue(true);
    deficiencyCategory?.patchValue('foo');
    expect(DefectValidators.validateDefectNotes(notes as AbstractControl)).toBeNull();
  });

  it('should return null if deficiency category is not dangerous* and prohibition issued is no and value of control is not defined', () => {
    const notes = form.get(['parent', 'notes']);
    const prohibitionIssued = form.get('prohibitionIssued');
    const deficiencyCategory = form.get('deficiencyCategory');
    prohibitionIssued?.patchValue(false);
    deficiencyCategory?.patchValue('foo');
    expect(DefectValidators.validateDefectNotes(notes as AbstractControl)).toBeNull();
  });

  it('should return null if deficiency category is dangerous* and prohibition issued is no and value of control is defined', () => {
    const notes = form.get(['parent', 'notes']);
    const prohibitionIssued = form.get('prohibitionIssued');
    const deficiencyCategory = form.get('deficiencyCategory');
    notes?.patchValue('foo');
    prohibitionIssued?.patchValue(false);
    deficiencyCategory?.patchValue('dangerous*');
    expect(DefectValidators.validateDefectNotes(notes as AbstractControl)).toBeNull();
  });
});
