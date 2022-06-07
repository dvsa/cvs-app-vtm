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
    (form.controls['foo'] as CustomFormControl).meta.hide = true;
    form.controls['bar'].patchValue('bar');
    CustomValidator.hide('foo')(form.controls['bar'] as AbstractControl);
    expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(false);
  });
});

describe('Hide if equals', () => {
  let form: FormGroup;
  beforeEach(() => {
    form = new FormGroup({
      foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
      bar: new CustomFormControl({ name: 'bar', type: FormNodeTypes.CONTROL, children: [] }, null)
    });
  });
  it('should return null', () => {
    expect(CustomValidator.hideIfEquals('foo', 'foo')(form.controls['bar'] as AbstractControl)).toEqual(null);
  });

  it('should set meta.hide to true if content of sibling is equal to the value passed', () => {
    const value = 'bar';
    form.controls['bar'].patchValue(value);
    CustomValidator.hideIfEquals('foo', 'bar')(form.controls['bar'] as AbstractControl);
    expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(true);
  });

  it('should set meta.hide to true if content of sibling is equal to one of the values passed in the array', () => {
    const value = 'bar';
    form.controls['bar'].patchValue(value);
    CustomValidator.hideIfEquals('foo', ['bar', 'foo', 'foobar'])(form.controls['bar'] as AbstractControl);
    expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(true);
  });

  it('should set meta.hide to false if content of sibling is not equal to the value passed', () => {
    const value = 'bar';
    form.controls['bar'].patchValue(value);
    (form.controls['foo'] as CustomFormControl).meta.hide = true;
    CustomValidator.hideIfEquals('foo', 'foo')(form.controls['bar'] as AbstractControl);
    expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(false);
  });
});

describe('Hide if not equals', () => {
  let form: FormGroup;
  beforeEach(() => {
    form = new FormGroup({
      foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
      bar: new CustomFormControl({ name: 'bar', type: FormNodeTypes.CONTROL, children: [] }, null)
    });
  });
  it('should return null', () => {
    expect(CustomValidator.hideIfNotEqual('foo', 'foo')(form.controls['bar'] as AbstractControl)).toEqual(null);
  });

  it('should set meta.hide to true if content of sibling is not equal to the value passed', () => {
    const value = 'foo';
    form.controls['bar'].patchValue(value);
    CustomValidator.hideIfNotEqual('foo', 'bar')(form.controls['bar'] as AbstractControl);
    expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(true);
  });

  it('should set meta.hide to true if content of sibling is not equal to any of the values passed in the array', () => {
    const value = 'value';
    form.controls['bar'].patchValue(value);
    CustomValidator.hideIfNotEqual('foo', ['bar', 'foo', 'foobar'])(form.controls['bar'] as AbstractControl);
    expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(true);
  });

  it('should set meta.hide to false if content of sibling is equal to the value passed', () => {
    const value = 'bar';
    form.controls['bar'].patchValue(value);
    (form.controls['foo'] as CustomFormControl).meta.hide = true;
    CustomValidator.hideIfNotEqual('foo', 'bar')(form.controls['bar'] as AbstractControl);
    expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(false);
  });
});
