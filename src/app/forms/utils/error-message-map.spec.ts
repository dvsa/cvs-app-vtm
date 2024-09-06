import { AsyncValidatorNames } from '@models/async-validators.enum';
import { ValidatorNames } from '@models/validators.enum';
import { ErrorMessageMap } from './error-message-map';

describe('ErrorMessageMap', () => {
	it.each([
		['This field is required', ValidatorNames.Required, [true, '']],
		['This field is required', ValidatorNames.Required, [true, undefined]],
		['This field is required', ValidatorNames.Required, [true, null]],
		['Name is required', ValidatorNames.Required, [true, 'Name']],
		['This field must match a pattern', ValidatorNames.Pattern, [true, '']],
		['Name must match a pattern', ValidatorNames.Pattern, [true, 'Name']],
		['This field must match pattern xxx', ValidatorNames.CustomPattern, [{ message: 'must match pattern xxx' }, '']],
		['Name must match pattern xxx', ValidatorNames.CustomPattern, [{ message: 'must match pattern xxx' }, 'Name']],
		["'Date' is not valid", 'invalidDate', [{ error: true, reason: "'Date' is not valid" }]],
		['Name must be less than or equal to 14 characters', ValidatorNames.MaxLength, [{ requiredLength: 14 }, 'Name']],
		['This field must be less than or equal to 14 characters', ValidatorNames.MaxLength, [{ requiredLength: 14 }, '']],
		['Name must be greater than or equal to 14 characters', ValidatorNames.MinLength, [{ requiredLength: 14 }, 'Name']],
		[
			'This field must be greater than or equal to 14 characters',
			ValidatorNames.MinLength,
			[{ requiredLength: 14 }, ''],
		],
		['Name is required with Surname', ValidatorNames.RequiredIfEquals, [{ sibling: 'Surname' }, 'Name']],
		['This field is required with Surname', ValidatorNames.RequiredIfEquals, [{ sibling: 'Surname' }, '']],
		['Notes is required', ValidatorNames.ValidateDefectNotes, undefined],
		['foo', 'invalidTestResult', [{ message: 'foo' }]],
		['This field must be less than or equal to 5', ValidatorNames.Max, [{ max: 5 }, '']],
		['Number must be less than or equal to 5', ValidatorNames.Max, [{ max: 5 }, 'Number']],
		['This field must be greater than or equal to 5', ValidatorNames.Min, [{ min: 5 }, '']],
		['Number must be greater than or equal to 5', ValidatorNames.Min, [{ min: 5 }, 'Number']],
		['Date must be in the past', ValidatorNames.PastDate, [true, 'Date']],
		['This date must be in the past', ValidatorNames.PastDate, [true, undefined]],
		['Date must be in the future', ValidatorNames.FutureDate, [true, 'Date']],
		['This date must be in the future', ValidatorNames.FutureDate, [true, undefined]],
		['This date must be ahead of the previous date', ValidatorNames.AheadOfDate, [true, undefined]],
		['This year must be the current or a past year', ValidatorNames.PastYear, [true, undefined]],
		[
			'bar must be ahead of foo (20/01/2021)',
			ValidatorNames.AheadOfDate,
			[{ sibling: 'foo', date: new Date('2021-01-20T00:00:00.000Z') }, 'bar'],
		],
		['This field is required', AsyncValidatorNames.RequiredIfNotFail, [{ sibling: 'foo' }, '']],
		['Name is required', AsyncValidatorNames.RequiredIfNotFail, [{ sibling: 'foo' }, 'Name']],
		['Prohibition notice has not been issued.', ValidatorNames.ValidateProhibitionIssued, undefined],
		['This field is required', AsyncValidatorNames.RequiredIfNotAbandoned, [{ sibling: 'foo' }, '']],
		['Name is required', AsyncValidatorNames.RequiredIfNotAbandoned, [{ sibling: 'foo' }, 'Name']],
		['This field is required', AsyncValidatorNames.RequiredIfNotResult, [{ sibling: 'foo' }, '']],
		['Name is required', AsyncValidatorNames.RequiredIfNotResult, [{ sibling: 'foo' }, 'Name']],
		['This field is required', AsyncValidatorNames.RequiredIfNotResultAndSiblingEquals, [{ sibling: 'foo' }, '']],
		['Name is required', AsyncValidatorNames.RequiredIfNotResultAndSiblingEquals, [{ sibling: 'foo' }, 'Name']],
		[
			'This date must be less than 10 months after the previous date',
			ValidatorNames.DateNotExceed,
			[{ months: '10' }, ''],
		],
		[
			'Name must be less than 15 months after foo',
			ValidatorNames.DateNotExceed,
			[{ sibling: 'foo', months: '15' }, 'Name'],
		],
	])('should return "%s" for %s with %o', (expected, key, props) => {
		if (props) {
			// @ts-ignore
			expect(ErrorMessageMap[`${key}`](...props)).toBe(expected);
		} else {
			// @ts-ignore
			expect(ErrorMessageMap[`${key}`]()).toBe(expected);
		}
	});
});
