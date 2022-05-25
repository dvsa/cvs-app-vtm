import { AbstractControl, FormGroup } from '@angular/forms';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { CustomValidator } from './custom-validators';

describe('Hide', () => {
  let form: FormGroup;
  beforeEach(() => {
    form = new FormGroup({
      foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
      bar: new CustomFormControl({ name: 'bar', type: FormNodeTypes.CONTROL, children: [] }, null)
    });
  });
  it('should return null', () => {
    expect(CustomValidator.hide('foo')(form.controls['bar'] as AbstractControl)).toEqual(null);
  });

  it('should set meta.hide to true if content of sibling is empty', () => {
    CustomValidator.hide('foo')(form.controls['bar'] as AbstractControl);
    expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(true);
  });

  it('should set meta.hide to false if content of sibling is not empty', () => {
    form.controls['bar'].patchValue('bar');
    CustomValidator.hide('foo')(form.controls['bar'] as AbstractControl);
    expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(false);
  });
});
