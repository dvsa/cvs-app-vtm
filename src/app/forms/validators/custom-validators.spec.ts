import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import {
  CustomFormControl, CustomFormGroup, FormNode, FormNodeTypes,
} from '@forms/services/dynamic-form.types';
import { VehicleSizes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { VehicleClass } from '@models/vehicle-class.model';
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
      sibling: new CustomFormControl({ name: 'sibling', type: FormNodeTypes.CONTROL, children: [] }, null),
    });
  });

  describe('Hide if empty', () => {
    it('should return null', () => {
      expect(CustomValidators.hideIfEmpty('foo')(form.controls['sibling'])).toBeNull();
    });

    it('should set meta.hide to true if content of sibling is empty', () => {
      CustomValidators.hideIfEmpty('foo')(form.controls['sibling']);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toBe(true);
    });

    it('should set meta.hide to false if content of sibling is not empty', () => {
      (form.controls['foo'] as CustomFormControl).meta.hide = true;
      form.controls['sibling'].patchValue('bar');
      CustomValidators.hideIfEmpty('foo')(form.controls['sibling']);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toBe(false);
    });
  });

  describe('Hide if equals', () => {
    it('should return null', () => {
      expect(CustomValidators.hideIfEquals('foo', 'foo')(form.controls['sibling'])).toBeNull();
    });

    it('should set meta.hide to true if content of sibling is equal to the value passed', () => {
      const value = 'bar';
      form.controls['sibling'].patchValue(value);
      CustomValidators.hideIfEquals('foo', 'bar')(form.controls['sibling']);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toBe(true);
    });

    it('should set meta.hide to true if content of sibling is equal to one of the values passed in the array', () => {
      const value = 'bar';
      form.controls['sibling'].patchValue(value);
      CustomValidators.hideIfEquals('foo', ['bar', 'foo', 'foobar'])(form.controls['sibling']);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toBe(true);
    });

    it('should set meta.hide to false if content of sibling is not equal to the value passed', () => {
      const value = 'bar';
      form.controls['sibling'].patchValue(value);
      (form.controls['foo'] as CustomFormControl).meta.hide = true;
      CustomValidators.hideIfEquals('foo', 'foo')(form.controls['sibling']);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toBe(false);
    });
  });

  describe('Hide if not equals', () => {
    it('should return null', () => {
      expect(CustomValidators.hideIfNotEqual('foo', 'foo')(form.controls['sibling'])).toBeNull();
    });

    it('should set meta.hide to true if content of sibling is not equal to the value passed', () => {
      const value = 'foo';
      form.controls['sibling'].patchValue(value);
      CustomValidators.hideIfNotEqual('foo', 'bar')(form.controls['sibling']);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toBe(true);
    });

    it('should set meta.hide to true if content of sibling is not equal to any of the values passed in the array', () => {
      const value = 'value';
      form.controls['sibling'].patchValue(value);
      CustomValidators.hideIfNotEqual('foo', ['bar', 'foo', 'foobar'])(form.controls['sibling']);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toBe(true);
    });

    it('should set meta.hide to false if content of sibling is equal to the value passed', () => {
      const value = 'bar';
      form.controls['sibling'].patchValue(value);
      (form.controls['foo'] as CustomFormControl).meta.hide = true;
      CustomValidators.hideIfNotEqual('foo', 'bar')(form.controls['sibling']);
      expect((form.controls['foo'] as CustomFormControl).meta.hide).toBe(false);
    });
  });
});

describe('enable/disable validators', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup({
      foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
      sibling: new CustomFormControl({ name: 'sibling', type: FormNodeTypes.CONTROL, children: [] }, null),
    });
  });

  describe('enable if equals', () => {
    it('should return null', () => {
      expect(CustomValidators.enableIfEquals('foo', 'foo')(form.controls['sibling'])).toBeNull();
    });

    it('should set enabled to true if content of sibling is equal to the value passed', () => {
      const value = 'bar';
      form.controls['sibling'].patchValue(value);
      CustomValidators.enableIfEquals('foo', 'bar')(form.controls['sibling']);
      expect((form.controls['foo'] as CustomFormControl).enabled).toBe(true);
    });

    it('should set enabled to true if content of sibling is equal to one of the values passed in the array', () => {
      const value = 'bar';
      form.controls['sibling'].patchValue(value);
      CustomValidators.enableIfEquals('foo', ['bar', 'foo', 'foobar'])(form.controls['sibling']);
      expect((form.controls['foo'] as CustomFormControl).enabled).toBe(true);
    });

    it('should set enabled to false if content of sibling is not equal to the value passed', () => {
      const value = 'bar';
      form.controls['sibling'].patchValue(value);
      (form.controls['foo'] as CustomFormControl).enable();
      CustomValidators.enableIfEquals('foo', 'foo')(form.controls['sibling']);
      expect((form.controls['foo'] as CustomFormControl).enabled).toBe(false);
    });
  });

  describe('disable if equals', () => {
    it('should return null', () => {
      expect(CustomValidators.disableIfEquals('foo', 'foo')(form.controls['sibling'])).toBeNull();
    });

    it('should set disabled to true if content of sibling is equal to the value passed', () => {
      const value = 'bar';
      form.controls['sibling'].patchValue(value);
      CustomValidators.disableIfEquals('foo', 'bar')(form.controls['sibling']);
      expect((form.controls['foo'] as CustomFormControl).disabled).toBe(true);
    });

    it('should set disabled to true if content of sibling is equal to one of the values passed in the array', () => {
      const value = 'bar';
      form.controls['sibling'].patchValue(value);
      CustomValidators.disableIfEquals('foo', ['bar', 'foo', 'foobar'])(form.controls['sibling']);
      expect((form.controls['foo'] as CustomFormControl).disabled).toBe(true);
    });

    it('should set disabled to false if content of sibling is not equal to the value passed', () => {
      const value = 'bar';
      form.controls['sibling'].patchValue(value);
      (form.controls['foo'] as CustomFormControl).disable();
      CustomValidators.disableIfEquals('foo', 'foo')(form.controls['sibling']);
      expect((form.controls['foo'] as CustomFormControl).disabled).toBe(false);
    });
  });
});

describe('parent sibling validators', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup({
      parent: new CustomFormGroup(
        { name: 'parent', type: FormNodeTypes.GROUP },
        { child: new CustomFormControl({ name: 'child', type: FormNodeTypes.CONTROL }) },
      ),
      sibling: new CustomFormControl({ name: 'sibling', type: FormNodeTypes.CONTROL, hide: false }),
    });
  });

  it('should return null', () => {
    expect(CustomValidators.hideIfParentSiblingEquals('foo', 'bar')(form.controls['sibling'])).toBeNull();
  });

  it('should set meta.hide to true if content of parent sibling is equal to the value passed', () => {
    const value = 'bar';
    const child = form.get(['parent', 'child']);
    child?.patchValue(value);
    CustomValidators.hideIfParentSiblingEquals('sibling', value)(child as AbstractControl);
    expect((form.controls['sibling'] as CustomFormControl).meta.hide).toBe(true);
  });

  it('should set meta.hide to true if content of parent sibling is not equal to the value passed', () => {
    const value = true;
    const child = form.get(['parent', 'child']);
    child?.patchValue(value);
    CustomValidators.hideIfParentSiblingNotEqual('sibling', !value)(child as AbstractControl);
    expect((form.controls['sibling'] as CustomFormControl).meta.hide).toBe(true);
  });
});

describe('Required validators', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup({
      foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
      sibling: new CustomFormControl({
        name: 'sibling', label: 'Sibling', type: FormNodeTypes.CONTROL, children: [],
      }, null),
    });
    form.controls['sibling'].patchValue('some value');
  });

  describe('Required if equals', () => {
    it('should be required (return ValidationErrors) if content of sibling matches a value', () => {
      const result = CustomValidators.requiredIfEquals('sibling', ['some value'])(form.controls['foo']);
      expect(result).toEqual({ requiredIfEquals: { sibling: 'Sibling' } });
    });

    it('should not be required (return null) if content of sibling does not match a value', () => {
      form.controls['sibling'].patchValue('some other value');
      const result = CustomValidators.requiredIfEquals('sibling', ['some value'])(form.controls['foo']);
      expect(result).toBeNull();
    });

    it('should not be required (return null) if content of sibling does matches a value and we have a value', () => {
      form.controls['foo'].patchValue('some foo value');
      const result = CustomValidators.requiredIfEquals('sibling', ['some value'])(form.controls['foo']);
      expect(result).toBeNull();
    });
  });

  describe('Required if not equal', () => {
    it('should not be required (return null) if content of sibling does not match a value', () => {
      const result = CustomValidators.requiredIfNotEqual('sibling', 'some value')(form.controls['foo']);
      expect(result).toBeNull();
    });

    it('should be required (return ValidationErrors) if content of sibling does not match a value', () => {
      const result = CustomValidators.requiredIfNotEqual('sibling', 'some other value')(form.controls['foo']);
      expect(result).toEqual({ requiredIfNotEqual: { sibling: 'Sibling' } });
    });

    it('should not be required (return null) if content of sibling does matches a value and we have a value', () => {
      form.controls['foo'].patchValue('some foo value');
      const result = CustomValidators.requiredIfEquals('sibling', ['some othervalue'])(form.controls['foo']);
      expect(result).toBeNull();
    });
  });

  describe('Must Equal Sibling', () => {
    it('should return null if content of sibling matches a value', () => {
      const value = 'some value';
      form.controls['foo'].patchValue(value);
      form.controls['sibling'].patchValue(value);
      const result = CustomValidators.mustEqualSibling('sibling')(form.controls['foo']);
      expect(result).toBeNull();
    });

    it('should return ValidationErrors if content of sibling does not match the value', () => {
      const value = 'some value';
      form.controls['foo'].patchValue(value);
      form.controls['sibling'].patchValue('some other value');
      const result = CustomValidators.mustEqualSibling('sibling')(form.controls['foo']);
      expect(result).toEqual({ mustEqualSibling: { sibling: 'Sibling' } });
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
    [null, null],
  ])('should return %o for %r', (expected: null | CustomPatternMessage, input: any) => {
    const numberValidator = CustomValidators.numeric();
    expect(numberValidator(new FormControl(input))).toEqual(expected);
  });
});

describe('defined', () => {
  it.each([
    [{ defined: false }, undefined],
    [null, ''],
    [null, null],
    [null, 'hello world!'],
    [null, 1234],
  ])('should return %o for %r', (expected: null | { [index: string]: boolean }, input: any) => {
    const definedValidator = CustomValidators.defined();
    const form = new FormControl(input);
    if (typeof input === 'undefined') {
      // Unable to instantiate form with a value that is not defined...
      form.patchValue(undefined);
    }
    expect(definedValidator(form)).toEqual(expected);
  });
});

describe('alphanumeric', () => {
  it.each([
    [null, '12dc9a'],
    [null, 0],
    [null, 'asas'],
    [{ customPattern: { message: 'must be alphanumeric' } }, 'foobar+'],
    [{ customPattern: { message: 'must be alphanumeric' } }, '123456bar-'],
    [{ customPattern: { message: 'must be alphanumeric' } }, 'foo123456^@'],
    [null, '123546789abcdefghijklmnopqrstuvwxyz'],
    [null, null],
  ])('should return %o for %r', (expected: null | CustomPatternMessage, input: any) => {
    const numberValidator = CustomValidators.alphanumeric();
    expect(numberValidator(new FormControl(input))).toEqual(expected);
  });
});

describe('customPattern', () => {
  it.each([
    [null, 123456789, '.*', 'this should always pass'],
    [null, 'jkl', 'c*', 'this should be a character'],
    [{ customPattern: { message: 'this should not be a number' } }, 123456789, '\\D+', 'this should not be a number'],
    [null, '%^', '^\\W+$', 'this should be a symbol'],
    [null, null, '.*', 'pass on null'],
  ])('should return %o for %r', (expected: null | CustomPatternMessage, input: any, regex: string, msg: string) => {
    const customPattern = CustomValidators.customPattern([regex, msg]);
    const validation = customPattern(new FormControl(input));
    expect(validation).toEqual(expected);
    if (validation) {
      // eslint-disable-next-line prefer-destructuring
      const message = validation['customPattern']['message'];
      // eslint-disable-next-line jest/no-conditional-expect
      expect(message).toEqual(msg);
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(validation).toBeNull();
    }
  });

  it('should throw an error if an invalid regex is given', () => {
    expect(CustomValidators.customPattern(['regex', 'msg'])).toThrow();
  });
});

describe('invalidOption', () => {
  it.each([
    [null, ''],
    [{ invalidOption: true }, '[INVALID_OPTION]'],
  ])('should return %p when control value is %s', (expected: object | null, input: string) => {
    expect(CustomValidators.invalidOption(new FormControl(input))).toEqual(expected);
  });
});

describe('pastDate', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-01-01T00:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it.each([
    [null, ''],
    [null, null],
    [null, '2020-01-01T00:00:00.000Z'],
    [{ pastDate: true }, '2022-01-01T00:00:01.000Z'],
  ])('should return %p when control value is %s', (expected: object | null, input: string | null) => {
    expect(CustomValidators.pastDate(new FormControl(input))).toEqual(expected);
  });
});

describe('futureDate', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-01-01T00:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it.each([
    [null, ''],
    [null, null],
    [null, '2022-01-01T00:00:01.000Z'],
    [{ futureDate: true }, '2020-01-01T00:00:00.000Z'],
  ])('should return %p when control value is %s', (expected: object | null, input: string | null) => {
    expect(CustomValidators.futureDate(new FormControl(input))).toEqual(expected);
  });
});

describe('aheadOfDate', () => {
  let form: FormGroup;
  beforeEach(() => {
    form = new FormGroup({
      foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
      sibling: new CustomFormControl({
        name: 'sibling', label: 'sibling', type: FormNodeTypes.CONTROL, children: [],
      }, null),
    });
  });

  describe('tests', () => {
    it('should return an error message if sibling date is ahead of foo', () => {
      form.controls['foo'].patchValue(new Date('2020-01-01T00:00:00.000Z').toISOString());
      form.controls['sibling'].patchValue(new Date('2021-01-01T00:00:00.000Z').toISOString());

      const result = CustomValidators.aheadOfDate('sibling')(form.controls['foo']);
      expect(result).toEqual({ aheadOfDate: { sibling: 'sibling', date: new Date('2021-01-01T00:00:00.000Z') } });
    });

    it('should return null if sibling date is not ahead of foo', () => {
      form.controls['foo'].patchValue(new Date('2021-01-01T00:00:00.000Z').toISOString());
      form.controls['sibling'].patchValue(new Date('2020-01-01T00:00:00.000Z').toISOString());

      const result = CustomValidators.aheadOfDate('sibling')(form.controls['foo']);
      expect(result).toBeNull();
    });
  });
});

describe('dateNotExceed', () => {
  let form: FormGroup;
  beforeEach(() => {
    form = new FormGroup({
      foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
      sibling: new CustomFormControl({
        name: 'sibling', label: 'sibling', type: FormNodeTypes.CONTROL, children: [],
      }, null),
    });
  });

  describe('dateNotExceed tests', () => {
    it('should return an error message if sibling date plus 10 months is not ahead of foo', () => {
      form.controls['foo'].patchValue(new Date('2020-12-01T00:00:00.000Z').toISOString());
      form.controls['sibling'].patchValue(new Date('2020-01-01T00:00:00.000Z').toISOString());

      const result = CustomValidators.dateNotExceed('sibling', 10)(form.controls['foo']);
      expect(result).toEqual({ dateNotExceed: { sibling: 'sibling', months: 10 } });
    });

    it('should return an error message if sibling date plus 14 months is not ahead of foo', () => {
      form.controls['foo'].patchValue(new Date('2021-04-01T00:00:00.000Z').toISOString());
      form.controls['sibling'].patchValue(new Date('2020-01-01T00:00:00.000Z').toISOString());

      const result = CustomValidators.dateNotExceed('sibling', 14)(form.controls['foo']);
      expect(result).toEqual({ dateNotExceed: { sibling: 'sibling', months: 14 } });
    });

    it('should return null if sibling date plus 10 months is ahead of foo', () => {
      form.controls['foo'].patchValue(new Date('2020-09-01T00:00:00.000Z').toISOString());
      form.controls['sibling'].patchValue(new Date('2020-01-01T00:00:00.000Z').toISOString());

      const result = CustomValidators.dateNotExceed('sibling', 10)(form.controls['foo']);
      expect(result).toBeNull();
    });

    it('should return null if sibling date plus 14 months is ahead of foo', () => {
      form.controls['foo'].patchValue(new Date('2021-02-01T00:00:00.000Z').toISOString());
      form.controls['sibling'].patchValue(new Date('2020-01-01T00:00:00.000Z').toISOString());

      const result = CustomValidators.dateNotExceed('sibling', 14)(form.controls['foo']);
      expect(result).toBeNull();
    });
  });
});

describe('validate VRM/TrailerId Length', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup({
      parent: new CustomFormGroup(
        { name: 'parent', type: FormNodeTypes.GROUP },
        {
          child: new CustomFormControl({ name: 'child', type: FormNodeTypes.CONTROL }),
          sibling: new CustomFormControl({ name: 'sibling', type: FormNodeTypes.CONTROL }),
        },
      ),
    });
  });

  it('should return null when value is null', () => {
    const value = null;
    const child = form.get(['parent', 'child']);
    child?.patchValue(value);

    const result = CustomValidators.validateVRMTrailerIdLength('sibling')(child as AbstractControl);
    expect(result).toBeNull();
  });

  it('should return null when value is 7 characters long and Trailer is selected', () => {
    const value = 'TESTTRL';
    const child = form.get(['parent', 'child']);
    const sibling = form.get(['parent', 'sibling']);
    child?.patchValue(value);
    sibling?.patchValue(VehicleTypes.TRL);

    const result = CustomValidators.validateVRMTrailerIdLength('sibling')(child as AbstractControl);
    expect(result).toBeNull();
  });

  it('should return null when value is 8 characters long and Trailer is selected', () => {
    const value = 'TESTTRLR';
    const child = form.get(['parent', 'child']);
    const sibling = form.get(['parent', 'sibling']);
    child?.patchValue(value);
    sibling?.patchValue(VehicleTypes.TRL);

    const result = CustomValidators.validateVRMTrailerIdLength('sibling')(child as AbstractControl);
    expect(result).toBeNull();
  });

  it('should return null when value is 8 characters long', () => {
    const value = 'TESTTRLR';
    const child = form.get(['parent', 'child']);
    child?.patchValue(value);

    const result = CustomValidators.validateVRMTrailerIdLength('sibling')(child as AbstractControl);
    expect(result).toBeNull();
  });

  it('should return VRM max length error when value length is greater than 9', () => {
    const value = 'TESTVRM123';
    const child = form.get(['parent', 'child']);
    child?.patchValue(value);

    const result: any = CustomValidators.validateVRMTrailerIdLength('sibling')(child as AbstractControl);
    expect(result.validateVRMTrailerIdLength.message).toBe('VRM must be less than or equal to 9 characters');
  });

  it('should return TrailerId min length error when value length is less than 7 and Trailer is selected', () => {
    const value = 'TESTTR';
    const child = form.get(['parent', 'child']);
    const sibling = form.get(['parent', 'sibling']);
    child?.patchValue(value);
    sibling?.patchValue(VehicleTypes.TRL);

    const result: any = CustomValidators.validateVRMTrailerIdLength('sibling')(child as AbstractControl);
    expect(result.validateVRMTrailerIdLength.message).toBe('Trailer ID must be greater than or equal to 7 characters');
  });

  it('should return TrailerId max length error when value length is greater than 8 and Trailer is selected', () => {
    const value = 'TESTTRLRR';
    const child = form.get(['parent', 'child']);
    const sibling = form.get(['parent', 'sibling']);
    child?.patchValue(value);
    sibling?.patchValue(VehicleTypes.TRL);

    const result: any = CustomValidators.validateVRMTrailerIdLength('sibling')(child as AbstractControl);
    expect(result.validateVRMTrailerIdLength.message).toBe('Trailer ID must be less than or equal to 8 characters');
  });
});

describe('handlePsvPassengersChange', () => {
  let form: FormGroup;
  beforeEach(() => {
    form = new FormGroup({
      techRecord_vehicleSize: new CustomFormControl({ name: 'techRecord_vehicleSize', type: FormNodeTypes.CONTROL }, undefined),
      techRecord_vehicleClass_description: new CustomFormControl(
        { name: 'techRecord_vehicleClass_description', type: FormNodeTypes.CONTROL },
        undefined,
      ),
      techRecord_seatsLowerDeck: new CustomFormControl({ name: 'techRecord_seatsLowerDeck', type: FormNodeTypes.CONTROL }, undefined),
      techRecord_seatsUpperDeck: new CustomFormControl({ name: 'techRecord_seatsUpperDeck', type: FormNodeTypes.CONTROL }, undefined),
      techRecord_standingCapacity: new CustomFormControl({ name: 'techRecord_standingCapacity', type: FormNodeTypes.CONTROL }, undefined),
    });
  });
  it('should calculate small vehicle size and class based on passenger numbers', () => {
    const upper = form.get('techRecord_seatsUpperDeck');
    const lower = form.get('techRecord_seatsLowerDeck');
    const standing = form.get('techRecord_standingCapacity');

    upper?.patchValue(1);
    lower?.patchValue(2);
    standing?.patchValue(3);
    standing?.markAsDirty();

    CustomValidators.handlePsvPassengersChange('techRecord_seatsUpperDeck', 'techRecord_seatsLowerDeck')(standing as AbstractControl);
    const vehicleSize = form.get('techRecord_vehicleSize')?.value;
    const vehicleClass = form.get('techRecord_vehicleClass_description')?.value;

    expect(vehicleSize).toBe(VehicleSizes.SMALL);
    expect(vehicleClass).toBe(VehicleClass.DescriptionEnum.SmallPsvIeLessThanOrEqualTo22Seats);
  });
  it('should calculate large vehicle size and class based on passenger numbers', () => {
    const upper = form.get('techRecord_seatsUpperDeck');
    const lower = form.get('techRecord_seatsLowerDeck');
    const standing = form.get('techRecord_standingCapacity');

    upper?.patchValue(13);
    lower?.patchValue(22);
    standing?.patchValue(1);
    standing?.markAsDirty();

    CustomValidators.handlePsvPassengersChange('techRecord_seatsUpperDeck', 'techRecord_seatsLowerDeck')(standing as AbstractControl);
    const vehicleSize = form.get('techRecord_vehicleSize')?.value;
    const vehicleClass = form.get('techRecord_vehicleClass_description')?.value;

    expect(vehicleSize).toBe(VehicleSizes.LARGE);
    expect(vehicleClass).toBe(VehicleClass.DescriptionEnum.LargePsvIeGreaterThan23Seats);
  });
});
