import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { VehicleClassDescription } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescription.enum.js';
import { ValidatorNames } from '@models/validators.enum';
import { VehicleSizes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { CustomValidators } from '../custom-validators';

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
				{ child: new CustomFormControl({ name: 'child', type: FormNodeTypes.CONTROL }) }
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
			sibling: new CustomFormControl(
				{
					name: 'sibling',
					label: 'Sibling',
					type: FormNodeTypes.CONTROL,
					children: [],
				},
				null
			),
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

		it('should not be required (return null) when the sibling and control values overlap (for arrays)', () => {
			form.controls['foo'].patchValue(['battery']);
			form.controls['sibling'].patchValue(['battery']);
			const result = CustomValidators.requiredIfEquals('sibling', ['battery'])(form.controls['foo']);
			expect(result).toBeNull();
		});

		it('should not be required (return null) when sibling value does not match passed value', () => {
			form.controls['foo'].patchValue(['not a battery']);
			const result = CustomValidators.requiredIfEquals('sibling', ['battery'])(form.controls['foo']);
			expect(result).toBeNull();
		});

		it('should  be required (return null) when sibling value overlaps with values passed, and control is empty', () => {
			form.controls['sibling'].patchValue(['battery']);
			form.controls['foo'].patchValue([null]); // array with only falsy values is considered empty
			const result = CustomValidators.requiredIfEquals('sibling', ['battery'])(form.controls['foo']);
			expect(result).toEqual({ requiredIfEquals: { sibling: 'Sibling' } });
		});

		it('should not be required (return null) when sibling value overlaps with values passed, and control is not empty', () => {
			form.controls['sibling'].patchValue(['battery']);
			form.controls['foo'].patchValue([null, 'truthy']); // array with a falsy value, but some truthy values is considered NOT empty
			const result = CustomValidators.requiredIfEquals('sibling', ['battery'])(form.controls['foo']);
			expect(result).toBeNull();
		});
	});

	describe('Required if not equal', () => {
		it('should not be required (return null) if content of sibling does not match a value', () => {
			const result = CustomValidators.requiredIfNotEquals('sibling', 'some value')(form.controls['foo']);
			expect(result).toBeNull();
		});

		it('should be required (return ValidationErrors) if content of sibling does not match a value', () => {
			const result = CustomValidators.requiredIfNotEquals('sibling', 'some other value')(form.controls['foo']);
			expect(result).toEqual({ requiredIfNotEquals: { sibling: 'Sibling' } });
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
	])('should return %o for %r', (expected: null | CustomPatternMessage, input: unknown) => {
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
	])('should return %o for %r', (expected: null | { [index: string]: boolean }, input: unknown) => {
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
	])('should return %o for %r', (expected: null | CustomPatternMessage, input: unknown) => {
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
	])('should return %o for %r', (expected: null | CustomPatternMessage, input: unknown, regex: string, msg: string) => {
		const customPattern = CustomValidators.customPattern([regex, msg]);
		const validation = customPattern(new FormControl(input));
		expect(validation).toEqual(expected);
		if (validation) {
			const {
				customPattern: { message },
			} = validation;
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

describe('pastYear', () => {
	beforeAll(() => {
		jest.useFakeTimers().setSystemTime(new Date('2022-01-01T00:00:00.000Z'));
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it.each([
		[null, null],
		[{ pastYear: true }, 2023],
		[null, 2020],
	])('should return %p when control value is %s', (expected: object | null, input: number | null) => {
		expect(CustomValidators.pastYear(new FormControl(input))).toEqual(expected);
	});
});

describe('aheadOfDate', () => {
	let form: FormGroup;
	beforeEach(() => {
		form = new FormGroup({
			foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
			sibling: new CustomFormControl(
				{
					name: 'sibling',
					label: 'sibling',
					type: FormNodeTypes.CONTROL,
					children: [],
				},
				null
			),
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
			sibling: new CustomFormControl(
				{
					name: 'sibling',
					label: 'sibling',
					type: FormNodeTypes.CONTROL,
					children: [],
				},
				null
			),
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
				}
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

		const result = CustomValidators.validateVRMTrailerIdLength('sibling')(child as AbstractControl);
		expect(result?.['validateVRMTrailerIdLength'].message).toBe('VRM must be less than or equal to 9 characters');
	});

	it('should return TrailerId min length error when value length is less than 7 and Trailer is selected', () => {
		const value = 'TESTTR';
		const child = form.get(['parent', 'child']);
		const sibling = form.get(['parent', 'sibling']);
		child?.patchValue(value);
		sibling?.patchValue(VehicleTypes.TRL);

		const result = CustomValidators.validateVRMTrailerIdLength('sibling')(child as AbstractControl);
		expect(result?.['validateVRMTrailerIdLength'].message).toBe(
			'Trailer ID must be greater than or equal to 7 characters'
		);
	});

	it('should return TrailerId max length error when value length is greater than 8 and Trailer is selected', () => {
		const value = 'TESTTRLRR';
		const child = form.get(['parent', 'child']);
		const sibling = form.get(['parent', 'sibling']);
		child?.patchValue(value);
		sibling?.patchValue(VehicleTypes.TRL);

		const result = CustomValidators.validateVRMTrailerIdLength('sibling')(child as AbstractControl);
		expect(result?.['validateVRMTrailerIdLength'].message).toBe(
			'Trailer ID must be less than or equal to 8 characters'
		);
	});
});

describe('handlePsvPassengersChange', () => {
	let form: FormGroup;
	beforeEach(() => {
		form = new FormGroup({
			techRecord_vehicleSize: new CustomFormControl(
				{ name: 'techRecord_vehicleSize', type: FormNodeTypes.CONTROL },
				undefined
			),
			techRecord_vehicleClass_description: new CustomFormControl(
				{ name: 'techRecord_vehicleClass_description', type: FormNodeTypes.CONTROL },
				undefined
			),
			techRecord_seatsLowerDeck: new CustomFormControl(
				{ name: 'techRecord_seatsLowerDeck', type: FormNodeTypes.CONTROL },
				undefined
			),
			techRecord_seatsUpperDeck: new CustomFormControl(
				{ name: 'techRecord_seatsUpperDeck', type: FormNodeTypes.CONTROL },
				undefined
			),
			techRecord_standingCapacity: new CustomFormControl(
				{ name: 'techRecord_standingCapacity', type: FormNodeTypes.CONTROL },
				undefined
			),
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

		CustomValidators.handlePsvPassengersChange(
			'techRecord_seatsUpperDeck',
			'techRecord_seatsLowerDeck'
		)(standing as AbstractControl);
		const vehicleSize = form.get('techRecord_vehicleSize')?.value;
		const vehicleClass = form.get('techRecord_vehicleClass_description')?.value;

		expect(vehicleSize).toBe(VehicleSizes.SMALL);
		expect(vehicleClass).toBe(VehicleClassDescription.SmallPsvIeLessThanOrEqualTo22Seats);
	});
	it('should calculate large vehicle size and class based on passenger numbers', () => {
		const upper = form.get('techRecord_seatsUpperDeck');
		const lower = form.get('techRecord_seatsLowerDeck');
		const standing = form.get('techRecord_standingCapacity');

		upper?.patchValue(13);
		lower?.patchValue(22);
		standing?.patchValue(1);
		standing?.markAsDirty();

		CustomValidators.handlePsvPassengersChange(
			'techRecord_seatsUpperDeck',
			'techRecord_seatsLowerDeck'
		)(standing as AbstractControl);
		const vehicleSize = form.get('techRecord_vehicleSize')?.value;
		const vehicleClass = form.get('techRecord_vehicleClass_description')?.value;

		expect(vehicleSize).toBe(VehicleSizes.LARGE);
		expect(vehicleClass).toBe(VehicleClassDescription.LargePsvIeGreaterThan23Seats);
	});
});
describe('updateFunctionCode', () => {
	let form: FormGroup;
	beforeEach(() => {
		form = new FormGroup({
			techRecord_vehicleConfiguration: new CustomFormControl(
				{ name: 'techRecord_vehicleConfiguration', type: FormNodeTypes.CONTROL },
				undefined
			),
			techRecord_functionCode: new CustomFormControl(
				{ name: 'techRecord_functionCode', type: FormNodeTypes.CONTROL },
				undefined
			),
		});
	});
	it('should set the function code to R if given a rigid vehicle configuration', () => {
		const functionCode = form.get('techRecord_functionCode');
		const vehicleConfiguration = form.get('techRecord_vehicleConfiguration');

		vehicleConfiguration?.patchValue('rigid');
		vehicleConfiguration?.markAsDirty();

		CustomValidators.updateFunctionCode()(vehicleConfiguration as AbstractControl);
		const value = functionCode?.value;
		expect(value).toBe('R');
	});
	it('should set the function code to A if given a articulated vehicle configuration', () => {
		const functionCode = form.get('techRecord_functionCode');
		const vehicleConfiguration = form.get('techRecord_vehicleConfiguration');

		vehicleConfiguration?.patchValue('articulated');
		vehicleConfiguration?.markAsDirty();

		CustomValidators.updateFunctionCode()(vehicleConfiguration as AbstractControl);
		const value = functionCode?.value;
		expect(value).toBe('A');
	});
	it('should set the function code to A if given a semi-trailer vehicle configuration', () => {
		const functionCode = form.get('techRecord_functionCode');
		const vehicleConfiguration = form.get('techRecord_vehicleConfiguration');

		vehicleConfiguration?.patchValue('semi-trailer');
		vehicleConfiguration?.markAsDirty();

		CustomValidators.updateFunctionCode()(vehicleConfiguration as AbstractControl);
		const value = functionCode?.value;
		expect(value).toBe('A');
	});
	it('should not set the function code if vehicle configuration is not in the map', () => {
		const functionCode = form.get('techRecord_functionCode');
		const vehicleConfiguration = form.get('techRecord_vehicleConfiguration');

		vehicleConfiguration?.patchValue('invalid');
		vehicleConfiguration?.markAsDirty();

		CustomValidators.updateFunctionCode()(vehicleConfiguration as AbstractControl);
		const value = functionCode?.value;
		expect(value).toBeUndefined();
	});
});

describe('showGroupsWhenEqualTo', () => {
	let form: FormGroup;
	beforeEach(() => {
		form = new CustomFormGroup(
			{
				name: 'form-group',
				type: FormNodeTypes.GROUP,
				children: [
					{
						name: 'dangerousGoods',
						value: false,
						type: FormNodeTypes.CONTROL,
					},
					{
						name: 'techRecord_adrDetails_applicantDetails_name',
						type: FormNodeTypes.CONTROL,
						hide: true,
						groups: ['adr'],
					},
					{
						name: 'techRecord_adrDetails_applicantDetails_street',
						type: FormNodeTypes.CONTROL,
						hide: true,
						groups: ['adr'],
					},
					{
						name: 'techRecord_adrDetails_applicantDetails_town',
						type: FormNodeTypes.CONTROL,
						hide: true,
						groups: ['adr'],
					},
				],
			},
			{
				dangerousGoods: new CustomFormControl(
					{
						name: 'dangerousGoods',
						type: FormNodeTypes.CONTROL,
					},
					undefined
				),
				techRecord_adrDetails_applicantDetails_name: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_applicantDetails_name',
						type: FormNodeTypes.CONTROL,
						hide: true,
						groups: ['adr', 'name'],
					},
					undefined
				),
				techRecord_adrDetails_applicantDetails_street: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_applicantDetails_street',
						type: FormNodeTypes.CONTROL,
						hide: true,
						groups: ['adr'],
					},
					undefined
				),
				techRecord_adrDetails_applicantDetails_town: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_applicantDetails_town',
						type: FormNodeTypes.CONTROL,
						hide: true,
						groups: ['adr'],
					},
					undefined
				),
			}
		);
	});
	it('should set hide as false on a control if it is in a group included in the array passed and values match true', () => {
		const adr = form.get('dangerousGoods');
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const street = form.get('techRecord_adrDetails_applicantDetails_street') as CustomFormControl;
		const town = form.get('techRecord_adrDetails_applicantDetails_town') as CustomFormControl;

		adr?.patchValue(true);

		CustomValidators.showGroupsWhenEqualTo([true], ['adr'])(adr as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(street?.meta.hide).toBe(false);
		expect(town?.meta.hide).toBe(false);
	});
	it('should set hide as false on a control if it is in a group included in the array passed and values match false', () => {
		const adr = form.get('dangerousGoods');
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const street = form.get('techRecord_adrDetails_applicantDetails_street') as CustomFormControl;
		const town = form.get('techRecord_adrDetails_applicantDetails_town') as CustomFormControl;

		adr?.patchValue(false);

		CustomValidators.showGroupsWhenEqualTo([false], ['adr'])(adr as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(street?.meta.hide).toBe(false);
		expect(town?.meta.hide).toBe(false);
	});
	it('should not change the hide flag if values dont match', () => {
		const adr = form.get('dangerousGoods');
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const street = form.get('techRecord_adrDetails_applicantDetails_street') as CustomFormControl;
		const town = form.get('techRecord_adrDetails_applicantDetails_town') as CustomFormControl;

		adr?.patchValue(true);

		CustomValidators.showGroupsWhenEqualTo([false], ['adr'])(adr as AbstractControl);

		expect(name?.meta.hide).toBe(true);
		expect(street?.meta.hide).toBe(true);
		expect(town?.meta.hide).toBe(true);
	});
	it('should only change hide on groups included in array', () => {
		const adr = form.get('dangerousGoods');
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const street = form.get('techRecord_adrDetails_applicantDetails_street') as CustomFormControl;
		const town = form.get('techRecord_adrDetails_applicantDetails_town') as CustomFormControl;

		adr?.patchValue(true);

		CustomValidators.showGroupsWhenEqualTo([true], ['name'])(adr as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(street?.meta.hide).toBe(true);
		expect(town?.meta.hide).toBe(true);
	});
});

describe('hideGroupsWhenEqualTo', () => {
	let form: CustomFormGroup;
	beforeEach(() => {
		form = new CustomFormGroup(
			{
				name: 'form-group',
				type: FormNodeTypes.GROUP,
				children: [
					{
						name: 'dangerousGoods',
						value: false,
						type: FormNodeTypes.CONTROL,
					},
					{
						name: 'techRecord_adrDetails_applicantDetails_name',
						type: FormNodeTypes.CONTROL,
						hide: false,
						groups: ['adr'],
					},
					{
						name: 'techRecord_adrDetails_applicantDetails_street',
						type: FormNodeTypes.CONTROL,
						hide: false,
						groups: ['adr'],
					},
					{
						name: 'techRecord_adrDetails_applicantDetails_town',
						type: FormNodeTypes.CONTROL,
						hide: false,
						groups: ['adr'],
					},
				],
			},
			{
				dangerousGoods: new CustomFormControl(
					{
						name: 'dangerousGoods',
						type: FormNodeTypes.CONTROL,
					},
					undefined
				),
				techRecord_adrDetails_applicantDetails_name: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_applicantDetails_name',
						type: FormNodeTypes.CONTROL,
						hide: false,
						groups: ['adr', 'name'],
					},
					undefined
				),
				techRecord_adrDetails_applicantDetails_street: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_applicantDetails_street',
						type: FormNodeTypes.CONTROL,
						hide: false,
						groups: ['adr'],
					},
					undefined
				),
				techRecord_adrDetails_applicantDetails_town: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_applicantDetails_town',
						type: FormNodeTypes.CONTROL,
						hide: false,
						groups: ['adr'],
					},
					undefined
				),
			}
		);
	});
	it('should set hide as true on a control if it is in a group included in the array passed and values match true', () => {
		const adr = form.get('dangerousGoods');
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const street = form.get('techRecord_adrDetails_applicantDetails_street') as CustomFormControl;
		const town = form.get('techRecord_adrDetails_applicantDetails_town') as CustomFormControl;

		adr?.patchValue(true);

		CustomValidators.hideGroupsWhenEqualTo([true], ['adr'])(adr as AbstractControl);

		expect(name?.meta.hide).toBe(true);
		expect(street?.meta.hide).toBe(true);
		expect(town?.meta.hide).toBe(true);
	});
	it('should set hide as true on a control if it is in a group included in the array passed and values match false', () => {
		const adr = form.get('dangerousGoods');
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const street = form.get('techRecord_adrDetails_applicantDetails_street') as CustomFormControl;
		const town = form.get('techRecord_adrDetails_applicantDetails_town') as CustomFormControl;

		adr?.patchValue(false);

		CustomValidators.hideGroupsWhenEqualTo([false], ['adr'])(adr as AbstractControl);

		expect(name?.meta.hide).toBe(true);
		expect(street?.meta.hide).toBe(true);
		expect(town?.meta.hide).toBe(true);
	});
	it('should not change the hide flag if values dont match', () => {
		const adr = form.get('dangerousGoods');
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const street = form.get('techRecord_adrDetails_applicantDetails_street') as CustomFormControl;
		const town = form.get('techRecord_adrDetails_applicantDetails_town') as CustomFormControl;

		adr?.patchValue(true);

		CustomValidators.hideGroupsWhenEqualTo([false], ['adr'])(adr as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(street?.meta.hide).toBe(false);
		expect(town?.meta.hide).toBe(false);
	});
	it('should only change hide on groups included in array', () => {
		const adr = form.get('dangerousGoods');
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const street = form.get('techRecord_adrDetails_applicantDetails_street') as CustomFormControl;
		const town = form.get('techRecord_adrDetails_applicantDetails_town') as CustomFormControl;

		adr?.patchValue(true);

		CustomValidators.hideGroupsWhenEqualTo([true], ['name'])(adr as AbstractControl);

		expect(name?.meta.hide).toBe(true);
		expect(street?.meta.hide).toBe(false);
		expect(town?.meta.hide).toBe(false);
	});
});

describe('addWarningIfFalse', () => {
	let form: CustomFormGroup;
	beforeEach(() => {
		form = new CustomFormGroup(
			{
				name: 'form-group',
				type: FormNodeTypes.GROUP,
				children: [
					{
						name: 'dangerousGoods',
						value: true,
						type: FormNodeTypes.CONTROL,
					},
					{
						name: 'techRecord_adrDetails_applicantDetails_name',
						type: FormNodeTypes.CONTROL,
						hide: false,
					},
				],
			},
			{
				dangerousGoods: new CustomFormControl(
					{
						name: 'dangerousGoods',
						type: FormNodeTypes.CONTROL,
					},
					undefined
				),
				techRecord_adrDetails_applicantDetails_name: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_applicantDetails_name',
						type: FormNodeTypes.CONTROL,
						hide: false,
					},
					undefined
				),
			}
		);
	});
	it('should display a warning if the value is false and it has adr fields on record', () => {
		const adr = form.get('dangerousGoods') as CustomFormControl;
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;

		name.patchValue('test');
		name.markAsTouched();
		adr.patchValue(false);
		adr.markAsDirty();

		CustomValidators.addWarningForAdrField('Test warning')(adr as AbstractControl);
		expect(adr.meta.warning).toBe('Test warning');
	});
	it('should remove the warning if the value true', () => {
		const adr = form.get('dangerousGoods') as CustomFormControl;
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;

		name.patchValue('test');
		name.markAsTouched();
		adr.patchValue(false);
		adr.markAsDirty();

		CustomValidators.addWarningForAdrField('Test warning')(adr as AbstractControl);
		expect(adr.meta.warning).toBe('Test warning');

		adr?.patchValue(true);

		CustomValidators.addWarningForAdrField('Test warning')(adr as AbstractControl);
		expect(adr.meta.warning).toBeUndefined();
	});
	it('should not have a warning if the control is pristine and value is false', () => {
		const adr = form.get('dangerousGoods') as CustomFormControl;

		adr.patchValue(false);

		CustomValidators.addWarningForAdrField('Test warning')(adr as AbstractControl);
		expect(adr.meta.warning).toBeUndefined();
	});
	it('should not have a warning if the value is false but there is no adr information on the record', () => {
		const adr = form.get('dangerousGoods') as CustomFormControl;

		adr.patchValue(false);
		adr.markAsDirty();

		CustomValidators.addWarningForAdrField('Test warning')(adr as AbstractControl);
		expect(adr.meta.warning).toBeUndefined();
	});
	it('should not have a warning if the control is pristine and value is true', () => {
		const adr = form.get('dangerousGoods') as CustomFormControl;

		adr?.patchValue(true);

		CustomValidators.addWarningForAdrField('Test warning')(adr as AbstractControl);
		expect(adr.meta.warning).toBeUndefined();
	});
});

describe('enum', () => {
	it.each([
		[{ enum: true }, Number.NaN],
		[{ enum: true }, undefined],
		[{ enum: true }, null],
		[{ enum: true }, ''],
		[{ enum: true }, 'Small series'],
		[null, 'NTA'],
		[null, 'ECTA'],
		[null, 'IVA'],
		[null, 'NSSTA'],
		[null, 'ECSSTA'],
		[null, 'GB WVTA'],
		[null, 'UKNI WVTA'],
		[null, 'EU WVTA Pre 23'],
		[null, 'EU WVTA 23 on'],
		[null, 'QNIG'],
		[null, 'Prov.GB WVTA'],
		[null, 'Small series NKSXX'],
		[null, 'Small series NKS'],
		[null, 'IVA - VCA'],
		[null, 'IVA - DVSA/NI'],
	])('should return %p when control value is %s', (expected: object | null, input) => {
		expect(CustomValidators.isMemberOfEnum(ApprovalType, { allowFalsy: false })(new FormControl(input))).toEqual(
			expected
		);
	});

	it.each([
		[null, Number.NaN],
		[null, undefined],
		[null, null],
		[null, ''],
		[{ enum: true }, 'Small series'],
		[null, 'NTA'],
		[null, 'ECTA'],
		[null, 'IVA'],
		[null, 'NSSTA'],
		[null, 'ECSSTA'],
		[null, 'GB WVTA'],
		[null, 'UKNI WVTA'],
		[null, 'EU WVTA Pre 23'],
		[null, 'EU WVTA 23 on'],
		[null, 'QNIG'],
		[null, 'Prov.GB WVTA'],
		[null, 'Small series NKSXX'],
		[null, 'Small series NKS'],
		[null, 'IVA - VCA'],
		[null, 'IVA - DVSA/NI'],
	])('should return %p when control value is %s', (expected: object | null, input) => {
		expect(CustomValidators.isMemberOfEnum(ApprovalType, { allowFalsy: true })(new FormControl(input))).toEqual(
			expected
		);
	});
});

describe('showGroupsWhenIncludes', () => {
	let form: CustomFormGroup;
	beforeEach(() => {
		form = new CustomFormGroup(
			{
				name: 'form-group',
				type: FormNodeTypes.GROUP,
				children: [
					{
						name: 'dangerousGoods',
						value: false,
						type: FormNodeTypes.CONTROL,
					},
					{
						name: 'techRecord_adrDetails_compatibilityGroupJ',
						type: FormNodeTypes.CONTROL,
						hide: true,
						groups: ['compat', 'details'],
					},
				],
			},
			{
				dangerousGoods: new CustomFormControl(
					{
						name: 'dangerousGoods',
						type: FormNodeTypes.CONTROL,
						groups: ['adr'],
					},
					undefined
				),
				techRecord_adrDetails_applicantDetails_name: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_applicantDetails_name',
						type: FormNodeTypes.CONTROL,
						hide: false,
						groups: ['adr', 'name'],
					},
					undefined
				),
				techRecord_adrDetails_permittedDangerousGoods: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_permittedDangerousGoods',
						type: FormNodeTypes.CONTROL,
						hide: false,
						groups: ['adr', 'details'],
						validators: [
							{
								name: ValidatorNames.ShowGroupsWhenIncludes,
								args: {
									values: [ADRDangerousGood.EXPLOSIVES_TYPE_2, ADRDangerousGood.EXPLOSIVES_TYPE_3],
									groups: ['compat'],
								},
							},
							{
								name: ValidatorNames.HideGroupsWhenExcludes,
								args: {
									values: [ADRDangerousGood.EXPLOSIVES_TYPE_2, ADRDangerousGood.EXPLOSIVES_TYPE_3],
									groups: ['compat'],
								},
							},
						],
					},
					undefined
				),
				techRecord_adrDetails_compatibilityGroupJ: new CustomFormControl({
					name: 'techRecord_adrDetails_compatibilityGroupJ',
					type: FormNodeTypes.CONTROL,
					hide: true,
					groups: ['compat', 'details'],
				}),
			}
		);
	});

	it('should set hide to FALSE when its value DOES include one of the values passed, and IS part of the group whitelist', () => {
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const permitted = form.get('techRecord_adrDetails_permittedDangerousGoods') as CustomFormControl;
		const compat = form.get('techRecord_adrDetails_compatibilityGroupJ') as CustomFormControl;

		permitted?.patchValue([ADRDangerousGood.EXPLOSIVES_TYPE_2]);
		permitted?.markAsDirty();

		CustomValidators.showGroupsWhenIncludes(
			[ADRDangerousGood.EXPLOSIVES_TYPE_2],
			['compat']
		)(permitted as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(compat?.meta.hide).toBe(false);
	});

	it('should NOT set hide to FALSE when its value DOES include one of the values passed, but is NOT part of the group whitelist', () => {
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const permitted = form.get('techRecord_adrDetails_permittedDangerousGoods') as CustomFormControl;
		const compat = form.get('techRecord_adrDetails_compatibilityGroupJ') as CustomFormControl;

		permitted?.patchValue(['I']);
		permitted?.markAsDirty();

		CustomValidators.showGroupsWhenIncludes(
			['I'],
			['random_group', 'other_random_group']
		)(permitted as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(compat?.meta.hide).toBe(true);
	});

	it('should NOT set hide to FALSE when its value DOES NOT include one of the values passed, but IS part of the group whitelist', () => {
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const permitted = form.get('techRecord_adrDetails_permittedDangerousGoods') as CustomFormControl;
		const compat = form.get('techRecord_adrDetails_compatibilityGroupJ') as CustomFormControl;

		permitted?.patchValue(['E']);
		permitted?.markAsDirty();

		CustomValidators.showGroupsWhenIncludes(['I'], ['compat', 'other_random_group'])(permitted as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(compat?.meta.hide).toBe(true);
	});
});

describe('hideGroupsWhenIncludes', () => {
	let form: CustomFormGroup;
	beforeEach(() => {
		form = new CustomFormGroup(
			{
				name: 'form-group',
				type: FormNodeTypes.GROUP,
				children: [
					{
						name: 'dangerousGoods',
						value: false,
						type: FormNodeTypes.CONTROL,
					},
					{
						name: 'techRecord_adrDetails_compatibilityGroupJ',
						type: FormNodeTypes.CONTROL,
						hide: true,
						groups: ['compat', 'details'],
					},
				],
			},
			{
				dangerousGoods: new CustomFormControl(
					{
						name: 'dangerousGoods',
						type: FormNodeTypes.CONTROL,
						groups: ['adr'],
					},
					undefined
				),
				techRecord_adrDetails_applicantDetails_name: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_applicantDetails_name',
						type: FormNodeTypes.CONTROL,
						hide: false,
						groups: ['adr', 'name'],
					},
					undefined
				),
				techRecord_adrDetails_permittedDangerousGoods: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_permittedDangerousGoods',
						type: FormNodeTypes.CONTROL,
						hide: false,
						groups: ['adr', 'details'],
						validators: [
							{
								name: ValidatorNames.ShowGroupsWhenIncludes,
								args: {
									values: [ADRDangerousGood.EXPLOSIVES_TYPE_2, ADRDangerousGood.EXPLOSIVES_TYPE_3],
									groups: ['compat'],
								},
							},
							{
								name: ValidatorNames.HideGroupsWhenExcludes,
								args: {
									values: [ADRDangerousGood.EXPLOSIVES_TYPE_2, ADRDangerousGood.EXPLOSIVES_TYPE_3],
									groups: ['compat'],
								},
							},
						],
					},
					undefined
				),
				techRecord_adrDetails_compatibilityGroupJ: new CustomFormControl({
					name: 'techRecord_adrDetails_compatibilityGroupJ',
					type: FormNodeTypes.CONTROL,
					hide: true,
					groups: ['compat', 'details'],
				}),
			}
		);
	});
	it('should set hide to TRUE when its value DOES include one of the values passed, and IS part of the group whitelist', () => {
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const permitted = form.get('techRecord_adrDetails_permittedDangerousGoods') as CustomFormControl;
		const compat = form.get('techRecord_adrDetails_compatibilityGroupJ') as CustomFormControl;

		permitted?.patchValue([ADRDangerousGood.EXPLOSIVES_TYPE_2]);
		permitted?.markAsDirty();

		CustomValidators.hideGroupsWhenIncludes(
			[ADRDangerousGood.EXPLOSIVES_TYPE_2],
			['compat']
		)(permitted as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(compat?.meta.hide).toBe(true);
	});

	it('should NOT set hide to TRUE when its value DOES include one of the values passed, but is NOT part of the group whitelist', () => {
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const permitted = form.get('techRecord_adrDetails_permittedDangerousGoods') as CustomFormControl;
		const compat = form.get('techRecord_adrDetails_compatibilityGroupJ') as CustomFormControl;
		compat.meta.hide = false;

		permitted?.patchValue([ADRDangerousGood.EXPLOSIVES_TYPE_2]);
		permitted?.markAsDirty();

		CustomValidators.hideGroupsWhenEqualTo(
			[ADRDangerousGood.EXPLOSIVES_TYPE_2],
			['compat', 'other_random_group']
		)(permitted as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(compat?.meta.hide).toBe(false);
	});

	it('should NOT set hide to TRUE when its value DOES NOT include one of the values passed, but IS part of the group whitelist', () => {
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const permitted = form.get('techRecord_adrDetails_permittedDangerousGoods') as CustomFormControl;
		const compat = form.get('techRecord_adrDetails_compatibilityGroupJ') as CustomFormControl;
		compat.meta.hide = false;

		permitted?.patchValue(['E']);
		permitted?.markAsDirty();

		CustomValidators.hideGroupsWhenIncludes(['I'], ['compat', 'other_random_group'])(permitted as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(compat?.meta.hide).toBe(false);
	});
});

describe('showGroupsWhenExcludes', () => {
	let form: CustomFormGroup;
	beforeEach(() => {
		form = new CustomFormGroup(
			{
				name: 'form-group',
				type: FormNodeTypes.GROUP,
				children: [
					{
						name: 'dangerousGoods',
						value: false,
						type: FormNodeTypes.CONTROL,
					},
					{
						name: 'techRecord_adrDetails_compatibilityGroupJ',
						type: FormNodeTypes.CONTROL,
						hide: true,
						groups: ['compat', 'details'],
					},
				],
			},
			{
				dangerousGoods: new CustomFormControl(
					{
						name: 'dangerousGoods',
						type: FormNodeTypes.CONTROL,
						groups: ['adr'],
					},
					undefined
				),
				techRecord_adrDetails_applicantDetails_name: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_applicantDetails_name',
						type: FormNodeTypes.CONTROL,
						hide: false,
						groups: ['adr', 'name'],
					},
					undefined
				),
				techRecord_adrDetails_permittedDangerousGoods: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_permittedDangerousGoods',
						type: FormNodeTypes.CONTROL,
						hide: false,
						groups: ['adr', 'details'],
						validators: [
							{
								name: ValidatorNames.ShowGroupsWhenIncludes,
								args: {
									values: [ADRDangerousGood.EXPLOSIVES_TYPE_2, ADRDangerousGood.EXPLOSIVES_TYPE_3],
									groups: ['compat'],
								},
							},
							{
								name: ValidatorNames.HideGroupsWhenExcludes,
								args: {
									values: [ADRDangerousGood.EXPLOSIVES_TYPE_2, ADRDangerousGood.EXPLOSIVES_TYPE_3],
									groups: ['compat'],
								},
							},
						],
					},
					undefined
				),
				techRecord_adrDetails_compatibilityGroupJ: new CustomFormControl({
					name: 'techRecord_adrDetails_compatibilityGroupJ',
					type: FormNodeTypes.CONTROL,
					hide: true,
					groups: ['compat', 'details'],
				}),
			}
		);
	});
	it('should set hide to FALSE when its value DOES NOT include one of the values passed, and IS part of the group whitelist', () => {
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const permitted = form.get('techRecord_adrDetails_permittedDangerousGoods') as CustomFormControl;
		const compat = form.get('techRecord_adrDetails_compatibilityGroupJ') as CustomFormControl;

		permitted?.patchValue([ADRDangerousGood.CARBON_DISULPHIDE]);
		permitted?.markAsDirty();

		CustomValidators.showGroupsWhenExcludes(
			[ADRDangerousGood.EXPLOSIVES_TYPE_2],
			['compat']
		)(permitted as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(compat?.meta.hide).toBe(false);
	});

	it('should NOT set hide to FALSE when its value DOES NOT include one of the values passed, but is NOT part of the group whitelist', () => {
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const permitted = form.get('techRecord_adrDetails_permittedDangerousGoods') as CustomFormControl;
		const compat = form.get('techRecord_adrDetails_compatibilityGroupJ') as CustomFormControl;

		permitted?.patchValue([ADRDangerousGood.CARBON_DISULPHIDE]);
		permitted?.markAsDirty();

		CustomValidators.showGroupsWhenExcludes(
			[ADRDangerousGood.EXPLOSIVES_TYPE_2],
			['other_group']
		)(permitted as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(compat?.meta.hide).toBe(true);
	});

	it('should NOT set hide to FALSE when its value DOES include one of the values passed, but IS part of the group whitelist', () => {
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const permitted = form.get('techRecord_adrDetails_permittedDangerousGoods') as CustomFormControl;
		const compat = form.get('techRecord_adrDetails_compatibilityGroupJ') as CustomFormControl;

		permitted?.patchValue([ADRDangerousGood.EXPLOSIVES_TYPE_2]);
		permitted?.markAsDirty();

		CustomValidators.showGroupsWhenExcludes(
			[ADRDangerousGood.EXPLOSIVES_TYPE_2],
			['compat']
		)(permitted as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(compat?.meta.hide).toBe(true);
	});
});

describe('hideGroupsWhenExcludes', () => {
	let form: CustomFormGroup;
	beforeEach(() => {
		form = new CustomFormGroup(
			{
				name: 'form-group',
				type: FormNodeTypes.GROUP,
				children: [
					{
						name: 'dangerousGoods',
						value: false,
						type: FormNodeTypes.CONTROL,
					},
					{
						name: 'techRecord_adrDetails_compatibilityGroupJ',
						type: FormNodeTypes.CONTROL,
						hide: true,
						groups: ['compat', 'details'],
					},
				],
			},
			{
				dangerousGoods: new CustomFormControl(
					{
						name: 'dangerousGoods',
						type: FormNodeTypes.CONTROL,
						groups: ['adr'],
					},
					undefined
				),
				techRecord_adrDetails_applicantDetails_name: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_applicantDetails_name',
						type: FormNodeTypes.CONTROL,
						hide: false,
						groups: ['adr', 'name'],
					},
					undefined
				),
				techRecord_adrDetails_permittedDangerousGoods: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_permittedDangerousGoods',
						type: FormNodeTypes.CONTROL,
						hide: false,
						groups: ['adr', 'details'],
						validators: [
							{
								name: ValidatorNames.ShowGroupsWhenIncludes,
								args: {
									values: [ADRDangerousGood.EXPLOSIVES_TYPE_2, ADRDangerousGood.EXPLOSIVES_TYPE_3],
									groups: ['compat'],
								},
							},
							{
								name: ValidatorNames.HideGroupsWhenExcludes,
								args: {
									values: [ADRDangerousGood.EXPLOSIVES_TYPE_2, ADRDangerousGood.EXPLOSIVES_TYPE_3],
									groups: ['compat'],
								},
							},
						],
					},
					undefined
				),
				techRecord_adrDetails_compatibilityGroupJ: new CustomFormControl({
					name: 'techRecord_adrDetails_compatibilityGroupJ',
					type: FormNodeTypes.CONTROL,
					hide: true,
					groups: ['compat', 'details'],
				}),
			}
		);
	});
	it('should set hide to TRUE when its value DOES NOT include one of the values passed, and IS part of the group whitelist', () => {
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const permitted = form.get('techRecord_adrDetails_permittedDangerousGoods') as CustomFormControl;
		const compat = form.get('techRecord_adrDetails_compatibilityGroupJ') as CustomFormControl;
		compat.meta.hide = false;

		permitted?.patchValue([ADRDangerousGood.CARBON_DISULPHIDE]);
		permitted?.markAsDirty();

		CustomValidators.hideGroupsWhenExcludes(
			[ADRDangerousGood.EXPLOSIVES_TYPE_2],
			['compat']
		)(permitted as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(compat?.meta.hide).toBe(true);
	});

	it('should NOT set hide to TRUE when its value DOES NOT include one of the values passed, but is NOT part of the group whitelist', () => {
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const permitted = form.get('techRecord_adrDetails_permittedDangerousGoods') as CustomFormControl;
		const compat = form.get('techRecord_adrDetails_compatibilityGroupJ') as CustomFormControl;
		compat.meta.hide = false;

		permitted?.patchValue([ADRDangerousGood.CARBON_DISULPHIDE]);
		permitted?.markAsDirty();

		CustomValidators.hideGroupsWhenExcludes(
			[ADRDangerousGood.EXPLOSIVES_TYPE_2],
			['other_group']
		)(permitted as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(compat?.meta.hide).toBe(false);
	});

	it('should NOT set hide to TRUE when its value DOES include one of the values passed, but IS part of the group whitelist', () => {
		const name = form.get('techRecord_adrDetails_applicantDetails_name') as CustomFormControl;
		const permitted = form.get('techRecord_adrDetails_permittedDangerousGoods') as CustomFormControl;
		const compat = form.get('techRecord_adrDetails_compatibilityGroupJ') as CustomFormControl;
		compat.meta.hide = false;

		permitted?.patchValue([ADRDangerousGood.EXPLOSIVES_TYPE_2]);
		permitted?.markAsDirty();

		CustomValidators.hideGroupsWhenExcludes(
			[ADRDangerousGood.EXPLOSIVES_TYPE_2],
			['compat']
		)(permitted as AbstractControl);

		expect(name?.meta.hide).toBe(false);
		expect(compat?.meta.hide).toBe(false);
	});
});

describe('isArray', () => {
	let form: CustomFormGroup;
	beforeEach(() => {
		form = new CustomFormGroup(
			{
				name: 'form-group',
				type: FormNodeTypes.GROUP,
				children: [
					{
						name: 'techRecord_adrDetails_additionalNotes_number',
						type: FormNodeTypes.CONTROL,
						value: [],
					},
				],
			},
			{
				techRecord_adrDetails_additionalNotes_number: new CustomFormControl(
					{
						name: 'techRecord_adrDetails_additionalNotes_number',
						type: FormNodeTypes.CONTROL,
					},
					undefined
				),
			}
		);
	});

	it('should NOT mark additional notes as INVALID when its value IS an ARRAY', () => {
		const control = form.get('techRecord_adrDetails_additionalNotes_number') as CustomFormControl;
		control.patchValue([]);

		expect(CustomValidators.isArray()(control)).toBeNull();
	});

	it('should mark additional notes as INVALID when its values is NOT an ARRAY', () => {
		const control = form.get('techRecord_adrDetails_additionalNotes_number') as CustomFormControl;
		control.patchValue('not an array');

		expect(CustomValidators.isArray()(control)).toBeTruthy();
	});

	it('should NOT mark additional notes as INVALID when its value is an ARRAY of type provided in the ofType argument', () => {
		const control = form.get('techRecord_adrDetails_additionalNotes_number') as CustomFormControl;
		control.patchValue(['1 string', '2 string']);
		expect(CustomValidators.isArray({ ofType: 'string' })(control)).toBeNull();

		control.patchValue([1, 2, 3]);
		expect(CustomValidators.isArray({ ofType: 'number' })(control)).toBeNull();

		// apparently null is object type in JS
		control.patchValue([null, null, null]);
		expect(CustomValidators.isArray({ ofType: 'object' })(control)).toBeNull();

		control.patchValue([undefined, undefined, undefined]);
		expect(CustomValidators.isArray({ ofType: 'undefined' })(control)).toBeNull();
	});

	it('should mark additional notes as INVALID when its value is an ARRAY but not of the type provided in the ofType argument', () => {
		const control = form.get('techRecord_adrDetails_additionalNotes_number') as CustomFormControl;
		control.patchValue(['1 string', '2 string']);
		expect(CustomValidators.isArray({ ofType: 'number' })(control)).toBeTruthy();

		control.patchValue([1, 2, 3]);
		expect(CustomValidators.isArray({ ofType: 'undefined' })(control)).toBeTruthy();

		control.patchValue([null, null, null]);
		expect(CustomValidators.isArray({ ofType: 'string' })(control)).toBeTruthy();

		control.patchValue([undefined, undefined, undefined]);
		expect(CustomValidators.isArray({ ofType: 'object' })(control)).toBeTruthy();
	});

	it('should NOT mark additional notes as INVALID when its value is an ARRAY and ALL of the values at indices in requiredIndices are truthy', () => {
		const control = form.get('techRecord_adrDetails_additionalNotes_number') as CustomFormControl;
		control.patchValue(['1 string', '2 string']);

		expect(CustomValidators.isArray({ requiredIndices: [1] })(control)).toBeNull();
	});

	it('should mark additional notes as INVALID when its value is an ARRAY but AT LEAST ONE of its values at requiredIndices is falsy', () => {
		const control = form.get('techRecord_adrDetails_additionalNotes_number') as CustomFormControl;
		control.patchValue([null, '2 string']);

		expect(CustomValidators.isArray({ requiredIndices: [0] })(control)).toBeTruthy();
	});
});

describe('tc3FieldTestValidator', () => {
	let form: FormGroup;

	beforeEach(() => {
		form = new CustomFormGroup(
			{
				name: 'group',
				label: 'Subsequent',
				type: FormNodeTypes.GROUP,
				children: [
					{
						name: 'tc3Type',
						type: FormNodeTypes.CONTROL,
						value: null,
						label: 'TC3: Inspection Type',
					},
					{
						name: 'tc3PeriodicNumber',
						label: 'TC3: Certificate Number',
						value: null,
						type: FormNodeTypes.CONTROL,
					},
					{
						name: 'tc3PeriodicExpiryDate',
						label: 'TC3: Expiry Date',
						type: FormNodeTypes.CONTROL,
						value: null,
						isoDate: false,
					},
				],
			},
			{
				tc3Type: new CustomFormControl({
					name: 'tc3Type',
					type: FormNodeTypes.CONTROL,
				}),
				tc3PeriodicNumber: new CustomFormControl({
					name: 'tc3PeriodicNumber',
					type: FormNodeTypes.CONTROL,
				}),
				tc3PeriodicExpiryDate: new CustomFormControl({
					name: 'tc3PeriodicExpiryDate',
					type: FormNodeTypes.CONTROL,
				}),
			}
		);
	});
	it('should give an error if all fields passed to the validator are null', () => {
		const type = form.get('tc3Type') as CustomFormControl;

		const validator = CustomValidators.tc3TestValidator({
			inspectionNumber: 1,
		})(type as AbstractControl);

		expect(validator).toEqual({
			tc3TestValidator: {
				message: 'TC3 Subsequent inspection 1 must have at least one populated field',
			},
		});
	});
	it('should give an error if fields passed to the validator are undefined', () => {
		const type = form.get('tc3Type') as CustomFormControl;
		const date = form.get('tc3PeriodicExpiryDate') as CustomFormControl;
		const number = form.get('tc3PeriodicNumber') as CustomFormControl;

		type.patchValue(undefined);
		date.patchValue(undefined);
		number.patchValue(undefined);

		const validator = CustomValidators.tc3TestValidator({
			inspectionNumber: 1,
		})(type as AbstractControl);

		expect(validator).toEqual({
			tc3TestValidator: {
				message: 'TC3 Subsequent inspection 1 must have at least one populated field',
			},
		});
	});
	it('should give an error if fields passed to the validator are empty strings', () => {
		const type = form.get('tc3Type') as CustomFormControl;
		const date = form.get('tc3PeriodicExpiryDate') as CustomFormControl;
		const number = form.get('tc3PeriodicNumber') as CustomFormControl;

		type.patchValue('');
		date.patchValue('');
		number.patchValue('');

		const validator = CustomValidators.tc3TestValidator({
			inspectionNumber: 1,
		})(type as AbstractControl);

		expect(validator).toEqual({
			tc3TestValidator: {
				message: 'TC3 Subsequent inspection 1 must have at least one populated field',
			},
		});
	});
	it('should give an error if fields to the validator have a variety of empty values', () => {
		const type = form.get('tc3Type') as CustomFormControl;
		const date = form.get('tc3PeriodicExpiryDate') as CustomFormControl;
		const number = form.get('tc3PeriodicNumber') as CustomFormControl;

		type.patchValue('');
		date.patchValue(null);
		number.patchValue(undefined);

		const validator = CustomValidators.tc3TestValidator({
			inspectionNumber: 1,
		})(type as AbstractControl);

		expect(validator).toEqual({
			tc3TestValidator: {
				message: 'TC3 Subsequent inspection 1 must have at least one populated field',
			},
		});
	});
	it('should return null if one field passed to the validator has a value', () => {
		const type = form.get('tc3Type') as CustomFormControl;
		const number = form.get('tc3PeriodicNumber') as CustomFormControl;

		number.patchValue('test');

		const validator = CustomValidators.tc3TestValidator({
			inspectionNumber: 1,
		})(type as AbstractControl);

		expect(validator).toBeNull();
	});
});

describe('tc3ParentValidator', () => {
	let form: FormGroup;

	beforeEach(() => {
		form = new CustomFormGroup(
			{
				name: 'group',
				label: 'Subsequent',
				type: FormNodeTypes.GROUP,
				children: [
					{
						name: 'techRecord_adrDetails_tank_tankDetails_tc3Details',
						type: FormNodeTypes.CONTROL,
						value: null,
					},
				],
			},
			{
				techRecord_adrDetails_tank_tankDetails_tc3Details: new CustomFormControl({
					name: 'techRecord_adrDetails_tank_tankDetails_tc3Details',
					type: FormNodeTypes.CONTROL,
				}),
			}
		);
	});
	it('should give an error if value contains a test with all null values', () => {
		const details = form.get('techRecord_adrDetails_tank_tankDetails_tc3Details') as CustomFormControl;

		details.patchValue([{ tc3Type: null, tc3PeriodicNumber: null, tc3PeriodicExpiryDate: null }]);

		const validator = CustomValidators.tc3TestValidator({ inspectionNumber: 0 })(details as AbstractControl);

		expect(validator).toEqual({
			tc3TestValidator: {
				message: 'TC3 Subsequent inspection 1 must have at least one populated field',
			},
		});
	});
	it('should give an error if fields passed to the validator are undefined', () => {
		const details = form.get('techRecord_adrDetails_tank_tankDetails_tc3Details') as CustomFormControl;

		details.patchValue([{ tc3Type: undefined, tc3PeriodicNumber: undefined, tc3PeriodicExpiryDate: undefined }]);

		const validator = CustomValidators.tc3TestValidator({ inspectionNumber: 0 })(details as AbstractControl);

		expect(validator).toEqual({
			tc3TestValidator: {
				message: 'TC3 Subsequent inspection 1 must have at least one populated field',
			},
		});
	});
	it('should give an error if fields passed to the validator are empty strings', () => {
		const details = form.get('techRecord_adrDetails_tank_tankDetails_tc3Details') as CustomFormControl;

		details.patchValue([{ tc3Type: '', tc3PeriodicNumber: '', tc3PeriodicExpiryDate: '' }]);

		const validator = CustomValidators.tc3TestValidator({ inspectionNumber: 0 })(details as AbstractControl);

		expect(validator).toEqual({
			tc3TestValidator: {
				message: 'TC3 Subsequent inspection 1 must have at least one populated field',
			},
		});
	});
	it('should give an error if fields to the validator have a variety of empty values', () => {
		const details = form.get('techRecord_adrDetails_tank_tankDetails_tc3Details') as CustomFormControl;

		details.patchValue([{ tc3Type: null, tc3PeriodicNumber: undefined, tc3PeriodicExpiryDate: '' }]);

		const validator = CustomValidators.tc3TestValidator({ inspectionNumber: 0 })(details as AbstractControl);

		expect(validator).toEqual({
			tc3TestValidator: {
				message: 'TC3 Subsequent inspection 1 must have at least one populated field',
			},
		});
	});
	it('should tell you which test needs to be filled out', () => {
		const details = form.get('techRecord_adrDetails_tank_tankDetails_tc3Details') as CustomFormControl;

		details.patchValue([
			{ tc3Type: null, tc3PeriodicNumber: 'test', tc3PeriodicExpiryDate: '' },
			{ tc3Type: null, tc3PeriodicNumber: undefined, tc3PeriodicExpiryDate: '' },
			{ tc3Type: null, tc3PeriodicNumber: 'test', tc3PeriodicExpiryDate: '' },
		]);

		const validator = CustomValidators.tc3TestValidator({ inspectionNumber: 0 })(details as AbstractControl);

		expect(validator).toEqual({
			tc3TestValidator: {
				message: 'TC3 Subsequent inspection 2 must have at least one populated field',
			},
		});
	});
	it('should tell you which test needs to be filled out if there are multiple', () => {
		const details = form.get('techRecord_adrDetails_tank_tankDetails_tc3Details') as CustomFormControl;

		details.patchValue([
			{ tc3Type: null, tc3PeriodicNumber: 'test', tc3PeriodicExpiryDate: '' },
			{ tc3Type: null, tc3PeriodicNumber: undefined, tc3PeriodicExpiryDate: '' },
			{ tc3Type: null, tc3PeriodicNumber: 'test', tc3PeriodicExpiryDate: '' },
			{ tc3Type: null, tc3PeriodicNumber: '', tc3PeriodicExpiryDate: '' },
			{ tc3Type: null, tc3PeriodicNumber: '', tc3PeriodicExpiryDate: '' },
		]);

		const validator = CustomValidators.tc3TestValidator({ inspectionNumber: 0 })(details as AbstractControl);

		expect(validator).toEqual({
			tc3TestValidator: {
				message: 'TC3 Subsequent inspection 2, 4, 5 must have at least one populated field',
			},
		});
	});
	it('should return null if one field passed to the validator has a value', () => {
		const details = form.get('techRecord_adrDetails_tank_tankDetails_tc3Details') as CustomFormControl;

		details.patchValue([{ tc3Type: 'test', tc3PeriodicNumber: null, tc3PeriodicExpiryDate: null }]);
		const validator = CustomValidators.tc3TestValidator({ inspectionNumber: 0 })(details as AbstractControl);

		expect(validator).toBeNull();
	});

	describe('dateIsValid', () => {
		it.each([
			[{ dateIsInvalid: { message: "'Date' day must be a number" } }, null],
			[{ dateIsInvalid: { message: "'Date' day must be a number" } }, undefined],
			[{ dateIsInvalid: { message: "'Date' day must be a number" } }, ''],
			[{ dateIsInvalid: { message: "'Date' day must be a number" } }, '---'],
			[{ dateIsInvalid: { message: "'Date' day must be a number" } }, '2000--'],
			[{ dateIsInvalid: { message: "'Date' day must be a number" } }, '2000-12-'],
			[{ dateIsInvalid: { message: "'Date' day must be a number" } }, '2000-12-A'],
			[null, '2000-12-01'],
			[null, '2000-12-11'],
			[null, '2000-12-31'],
			[{ dateIsInvalid: { message: "'Date' month must be a number" } }, '2000--11'],
			[{ dateIsInvalid: { message: "'Date' month must be a number" } }, '2000-C-11'],
			[{ dateIsInvalid: { message: "'Date' month must be between 1 and 12" } }, '2000-31-11'],
			[{ dateIsInvalid: { message: "'Date' month must be between 1 and 12" } }, '2000-00-11'],
			[{ dateIsInvalid: { message: "'Date' year must be a number" } }, '-12-11'],
			[{ dateIsInvalid: { message: "'Date' year must be a number" } }, 'C-12-11'],

			[null, '2020-02-29'],
			[{ dateIsInvalid: { message: "'Date' day must be between 1 and 28 in the month of February" } }, '2019-02-29'],
		])('should return %p when control value is %s', (expected: object | null, input) => {
			expect(CustomValidators.dateIsInvalid(new FormControl(input))).toEqual(expected);
		});
	});
});

describe('minArrayLengthIfNotEmpty', () => {
	it('should return null if the form array is empty', () => {
		const formArray = new FormArray([]);
		expect(CustomValidators.minArrayLengthIfNotEmpty(2, 'Error message')(formArray)).toBeNull();
	});

	it('should return an error if the array is not empty but doesnt reach minimum length', () => {
		const formArray = new FormArray([
			new FormControl({
				axleNumber: 1,
				tyres_tyreSize: null,
				tyres_fitmentCode: null,
				tyres_dataTrAxles: null,
				tyres_plyRating: null,
				tyres_tyreCode: null,
				weights_gbWeight: null,
				weights_designWeight: null,
				parkingBrakeMrk: false,
				weights_eecWeight: null,
			}),
		]);

		expect(CustomValidators.minArrayLengthIfNotEmpty(2, 'Error message')(formArray)).toStrictEqual(
			expect.objectContaining({
				minArrayLengthIfNotEmpty: { message: 'Error message' },
			})
		);
	});

	it('should return null if the minimum length is reached', () => {
		const formArray = new FormArray([
			new FormControl({
				axleNumber: 1,
				tyres_tyreSize: null,
				tyres_fitmentCode: null,
				tyres_dataTrAxles: null,
				tyres_plyRating: null,
				tyres_tyreCode: null,
				weights_gbWeight: null,
				weights_designWeight: null,
				parkingBrakeMrk: false,
				weights_eecWeight: null,
			}),
			new FormControl({
				axleNumber: 2,
				tyres_tyreSize: null,
				tyres_fitmentCode: null,
				tyres_dataTrAxles: null,
				tyres_plyRating: null,
				tyres_tyreCode: null,
				weights_gbWeight: null,
				weights_designWeight: null,
				parkingBrakeMrk: false,
				weights_eecWeight: null,
			}),
		]);

		expect(CustomValidators.minArrayLengthIfNotEmpty(2, 'Error message')(formArray)).toBeNull();
	});
});

describe('IssueRequired', () => {
	let form: FormGroup;

	beforeEach(() => {
		form = new FormGroup({
			testResult: new CustomFormControl({ type: FormNodeTypes.CONTROL, name: 'testResult' }, 'pass'),
			certificateNumber: new CustomFormControl({ type: FormNodeTypes.CONTROL, name: 'certificateNumber' }, null),
			centralDocs: new CustomFormGroup(
				{
					name: 'centralDocs',
					type: FormNodeTypes.GROUP,
					children: [{ type: FormNodeTypes.CONTROL, name: 'issueRequired' }],
				},
				{
					issueRequired: new CustomFormControl({ type: FormNodeTypes.CONTROL, name: 'issueRequired' }, true),
				}
			),
		});
	});

	describe('when issueRequired is true', () => {
		beforeEach(() => {
			form.get(['centralDocs', 'issueRequired'])?.patchValue(true);
		});

		it('should return null when testResult is prs', () => {
			form.get('testResult')?.patchValue('prs');
			const control = form.get('certificateNumber') as FormControl;
			expect(CustomValidators.issueRequired()(control)).toBeNull();
		});

		it('should return null when testResult is pass', () => {
			form.get('testResult')?.patchValue('pass');
			const control = form.get('certificateNumber') as FormControl;
			expect(CustomValidators.issueRequired()(control)).toBeNull();
		});
	});

	describe('when issueRequired is false', () => {
		beforeEach(() => {
			form.get(['centralDocs', 'issueRequired'])?.patchValue(false);
		});
		it('should return null when testResult is pass, but the control is populated', () => {
			form.get('testResult')?.patchValue('pass');
			const control = form.get('certificateNumber') as FormControl;
			control.patchValue('value');
			expect(CustomValidators.issueRequired()(control)).toBeNull();
		});

		it('should return error when testResult is pass, but the control is not populated', () => {
			form.get('testResult')?.patchValue('pass');
			const control = form.get('certificateNumber') as FormControl;
			control.patchValue(null);
			expect(CustomValidators.issueRequired()(control)).toEqual({
				requiredIfEquals: { customErrorMessage: undefined, sibling: undefined },
			});
		});
	});
});

describe('xYearsAfterCurrent', () => {
	let control: CustomFormControl;

	beforeEach(() => {
		// Set current year to 2024
		jest.useFakeTimers().setSystemTime(new Date('2024-01-01'));

		control = new CustomFormControl({
			type: FormNodeTypes.CONTROL,
			name: 'techRecord_manufactureYear',
			label: 'Year of Manufacture',
			value: 2024,
		});
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should allow the current year', () => {
		control.patchValue(2024);
		expect(CustomValidators.xYearsAfterCurrent(2)(control)).toBeNull();
	});

	it('should allow the current year +2 years', () => {
		control.patchValue(2026);
		expect(CustomValidators.xYearsAfterCurrent(2)(control)).toBeNull();
	});

	it('should allow the current year -2 years', () => {
		control.patchValue(2022);
		expect(CustomValidators.xYearsAfterCurrent(2)(control)).toBeNull();
	});

	it('should not allow the current year +3 years', () => {
		control.patchValue(2028);
		expect(CustomValidators.xYearsAfterCurrent(2)(control)).toEqual({
			xYearsAfterCurrent: { message: 'Year of Manufacture must be equal to or before 2026' },
		});
	});

	it('should not allow negative years', () => {
		control.patchValue(-100);
		expect(CustomValidators.xYearsAfterCurrent(2)(control)).toEqual({
			xYearsAfterCurrent: { message: 'Year of Manufacture must be equal to or before 2026' },
		});
	});
});
