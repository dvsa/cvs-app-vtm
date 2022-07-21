import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { CustomValidators } from './custom-validators';
interface CustomPatternMessage {
  customPattern: {
    message: string;
  };
}

describe('Hiding validators', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup({
      foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
      sibling: new CustomFormControl({ name: 'sibling', type: FormNodeTypes.CONTROL, children: [] }, null)
    });
  });

  describe('Hide if empty', () => {
    it('should return null', () => {
      expect(CustomValidators.hideIfEmpty('foo')(form.controls['sibling'] as AbstractControl)).toEqual(null);
    });

    it('should set meta.hide to true if content of sibling is empty', () => {
      CustomValidators.hideIfEmpty('foo')(form.controls['sibling'] as AbstractControl);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(true);
    });

    it('should set meta.hide to false if content of sibling is not empty', () => {
      (form.controls['foo'] as CustomFormControl).meta.hide = true;
      form.controls['sibling'].patchValue('bar');
      CustomValidators.hideIfEmpty('foo')(form.controls['sibling'] as AbstractControl);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(false);
    });
  });

  describe('Hide if equals', () => {
    it('should return null', () => {
      expect(CustomValidators.hideIfEquals('foo', 'foo')(form.controls['sibling'] as AbstractControl)).toEqual(null);
    });

    it('should set meta.hide to true if content of sibling is equal to the value passed', () => {
      const value = 'bar';
      form.controls['sibling'].patchValue(value);
      CustomValidators.hideIfEquals('foo', 'bar')(form.controls['sibling'] as AbstractControl);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(true);
    });

    it('should set meta.hide to true if content of sibling is equal to one of the values passed in the array', () => {
      const value = 'bar';
      form.controls['sibling'].patchValue(value);
      CustomValidators.hideIfEquals('foo', ['bar', 'foo', 'foobar'])(form.controls['sibling'] as AbstractControl);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(true);
    });

    it('should set meta.hide to false if content of sibling is not equal to the value passed', () => {
      const value = 'bar';
      form.controls['sibling'].patchValue(value);
      (form.controls['foo'] as CustomFormControl).meta.hide = true;
      CustomValidators.hideIfEquals('foo', 'foo')(form.controls['sibling'] as AbstractControl);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(false);
    });
  });

  describe('Hide if not equals', () => {
    it('should return null', () => {
      expect(CustomValidators.hideIfNotEqual('foo', 'foo')(form.controls['sibling'] as AbstractControl)).toEqual(null);
    });

    it('should set meta.hide to true if content of sibling is not equal to the value passed', () => {
      const value = 'foo';
      form.controls['sibling'].patchValue(value);
      CustomValidators.hideIfNotEqual('foo', 'bar')(form.controls['sibling'] as AbstractControl);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(true);
    });

    it('should set meta.hide to true if content of sibling is not equal to any of the values passed in the array', () => {
      const value = 'value';
      form.controls['sibling'].patchValue(value);
      CustomValidators.hideIfNotEqual('foo', ['bar', 'foo', 'foobar'])(form.controls['sibling'] as AbstractControl);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(true);
    });

    it('should set meta.hide to false if content of sibling is equal to the value passed', () => {
      const value = 'bar';
      form.controls['sibling'].patchValue(value);
      (form.controls['foo'] as CustomFormControl).meta.hide = true;
      CustomValidators.hideIfNotEqual('foo', 'bar')(form.controls['sibling'] as AbstractControl);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(false);
    });
  });
});

describe('parent sibling validators', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup({
      parent: new CustomFormGroup(
        { name: 'parent', type: FormNodeTypes.GROUP },
        { child: new CustomFormControl({ name: 'child', type: FormNodeTypes.CONTROL }) }
      ),
      sibling: new CustomFormControl({ name: 'sibling', type: FormNodeTypes.CONTROL, hide: false })
    });
  });

  it('should return null', () => {
    expect(CustomValidators.hideIfParentSiblingEquals('foo', 'bar')(form.controls['sibling'] as AbstractControl)).toEqual(null);
  });

  it('should set meta.hide to true if content of parent sibling is equal to the value passed', () => {
    const value = 'bar';
    const child = form.get(['parent', 'child']);
    child?.patchValue(value);
    CustomValidators.hideIfParentSiblingEquals('sibling', value)(child as AbstractControl);
    expect((form.controls['sibling'] as CustomFormControl).meta.hide).toEqual(true);
  });

  it('should set meta.hide to true if content of parent sibling is not equal to the value passed', () => {
    const value = true;
    const child = form.get(['parent', 'child']);
    child?.patchValue(value);
    CustomValidators.hideIfParentSiblingNotEqual('sibling', !value)(child as AbstractControl);
    expect((form.controls['sibling'] as CustomFormControl).meta.hide).toEqual(true);
  });
});

describe('Required validators', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup({
      foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
      sibling: new CustomFormControl({ name: 'sibling', label: 'Sibling', type: FormNodeTypes.CONTROL, children: [] }, null)
    });
    form.controls['sibling'].patchValue('some value');
  });

  describe('Required if equals', () => {
    it('should be required (return ValidationErrors) if content of sibling matches a value', () => {
      const result = CustomValidators.requiredIfEquals('sibling', 'some value')(form.controls['foo'] as AbstractControl);
      expect(result).toEqual({ requiredIfEquals: { sibling: 'Sibling' } });
    });

    it('should not be required (return null) if content of sibling does not match a value', () => {
      form.controls['sibling'].patchValue('some other value');
      const result = CustomValidators.requiredIfEquals('sibling', 'some value')(form.controls['foo'] as AbstractControl);
      expect(result).toBeNull();
    });

    it('should not be required (return null) if content of sibling does matches a value and we have a value', () => {
      form.controls['foo'].patchValue('some foo value');
      const result = CustomValidators.requiredIfEquals('sibling', 'some value')(form.controls['foo'] as AbstractControl);
      expect(result).toBeNull();
    });
  });

  describe('Required if not equal', () => {
    it('should not be required (return null) if content of sibling does not match a value', () => {
      const result = CustomValidators.requiredIfNotEqual('sibling', 'some value')(form.controls['foo'] as AbstractControl);
      expect(result).toBeNull();
    });

    it('should be required (return ValidationErrors) if content of sibling does not match a value', () => {
      const result = CustomValidators.requiredIfNotEqual('sibling', 'some other value')(form.controls['foo'] as AbstractControl);
      expect(result).toEqual({ requiredIfNotEqual: { sibling: 'Sibling' } });
    });

    it('should not be required (return null) if content of sibling does matches a value and we have a value', () => {
      form.controls['foo'].patchValue('some foo value');
      const result = CustomValidators.requiredIfEquals('sibling', 'some othervalue')(form.controls['foo'] as AbstractControl);
      expect(result).toBeNull();
    });
  });
});

describe('numeric', () => {
  it.each([
    [null, 123456789],
    [null, 0],
    [null, ''],
    [{ customPattern: { message: 'must be a whole number' } }, 'foobar'],
    [{ customPattern: { message: 'must be a whole number' } }, '123456bar'],
    [{ customPattern: { message: 'must be a whole number' } }, 'foo123456'],
    [null, '123546789'],
    [null, null]
  ])('should return %o for %r', (expected: null | CustomPatternMessage, input: any) => {
    const numberValidator = CustomValidators.numeric();
    expect(numberValidator(new FormControl(input))).toEqual(expected);
  });
});

describe('customPattern', () => {
  it.each([
    [null, 123456789, '.*', 'this should always pass'],
    [null, 'jkl', 'c*', 'this should be a character'],
    [{ customPattern: { message: 'this should not be a number' } }, 123456789, '\\D+', 'this should not be a number'],
    [null, '%^', '^\\W+$', 'this should be a symbol'],
    [null, null, '.*', 'pass on null']
  ])('should return %o for %r', (expected: null | CustomPatternMessage, input: any, regex: string, msg: string) => {
    const customPattern = CustomValidators.customPattern([regex, msg]);
    const validation = customPattern(new FormControl(input));
    expect(validation).toEqual(expected);
    if (validation) {
      const message = validation['customPattern']['message'];
      expect(message).toEqual(msg);
    } else {
      expect(validation).toBeNull();
    }
  });

  it('should throw an error if an invalid regex is given', () => {
    expect(CustomValidators.customPattern(['regex', 'msg'])).toThrowError();
  });
});

describe('invalidOption', () => {
  it.each([
    [null, ''],
    [{ invalidOption: true }, '[INVALID_OPTION]']
  ])('should return %p when control value is %s', (expected: object | null, input: string) => {
    expect(CustomValidators.invalidOption(new FormControl(input))).toEqual(expected);
  });
});
