import { AbstractControl, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
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
      bar: new CustomFormControl({ name: 'bar', type: FormNodeTypes.CONTROL, children: [] }, null)
    });
  });
  describe('Hide if empty', () => {
    it('should return null', () => {
      expect(CustomValidators.hideIfEmpty('foo')(form.controls['bar'] as AbstractControl)).toEqual(null);
    });

    it('should set meta.hide to true if content of sibling is empty', () => {
      CustomValidators.hideIfEmpty('foo')(form.controls['bar'] as AbstractControl);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(true);
    });

    it('should set meta.hide to false if content of sibling is not empty', () => {
      (form.controls['foo'] as CustomFormControl).meta.hide = true;
      form.controls['bar'].patchValue('bar');
      CustomValidators.hideIfEmpty('foo')(form.controls['bar'] as AbstractControl);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(false);
    });
  });
  describe('Hide if equals', () => {
    it('should return null', () => {
      expect(CustomValidators.hideIfEquals('foo', 'foo')(form.controls['bar'] as AbstractControl)).toEqual(null);
    });

    it('should set meta.hide to true if content of sibling is equal to the value passed', () => {
      const value = 'bar';
      form.controls['bar'].patchValue(value);
      CustomValidators.hideIfEquals('foo', 'bar')(form.controls['bar'] as AbstractControl);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(true);
    });

    it('should set meta.hide to true if content of sibling is equal to one of the values passed in the array', () => {
      const value = 'bar';
      form.controls['bar'].patchValue(value);
      CustomValidators.hideIfEquals('foo', ['bar', 'foo', 'foobar'])(form.controls['bar'] as AbstractControl);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(true);
    });

    it('should set meta.hide to false if content of sibling is not equal to the value passed', () => {
      const value = 'bar';
      form.controls['bar'].patchValue(value);
      (form.controls['foo'] as CustomFormControl).meta.hide = true;
      CustomValidators.hideIfEquals('foo', 'foo')(form.controls['bar'] as AbstractControl);
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
      expect(CustomValidators.hideIfNotEqual('foo', 'foo')(form.controls['bar'] as AbstractControl)).toEqual(null);
    });

    it('should set meta.hide to true if content of sibling is not equal to the value passed', () => {
      const value = 'foo';
      form.controls['bar'].patchValue(value);
      CustomValidators.hideIfNotEqual('foo', 'bar')(form.controls['bar'] as AbstractControl);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(true);
    });

    it('should set meta.hide to true if content of sibling is not equal to any of the values passed in the array', () => {
      const value = 'value';
      form.controls['bar'].patchValue(value);
      CustomValidators.hideIfNotEqual('foo', ['bar', 'foo', 'foobar'])(form.controls['bar'] as AbstractControl);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(true);
    });

    it('should set meta.hide to false if content of sibling is equal to the value passed', () => {
      const value = 'bar';
      form.controls['bar'].patchValue(value);
      (form.controls['foo'] as CustomFormControl).meta.hide = true;
      CustomValidators.hideIfNotEqual('foo', 'bar')(form.controls['bar'] as AbstractControl);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toEqual(false);
    });
  });
});

describe('numeric', () => {
  it.each([
    [null, 123456789],
    [null, 0],
    [null, ''],
    [{ customPattern: { message: 'must be a number' } }, 'foobar'],
    [{ customPattern: { message: 'must be a number' } }, '123456bar'],
    [{ customPattern: { message: 'must be a number' } }, 'foo123456'],
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
