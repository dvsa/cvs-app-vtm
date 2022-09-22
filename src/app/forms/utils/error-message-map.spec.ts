import { ValidatorNames } from '@forms/models/validators.enum';
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
    [`'Date' is not valid`, 'invalidDate', [{ error: true, reason: `'Date' is not valid` }]],
    ['Name must be less than 14 characters', ValidatorNames.MaxLength, [{ requiredLength: 14 }, 'Name']],
    ['This field must be less than 14 characters', ValidatorNames.MaxLength, [{ requiredLength: 14 }, '']],
    ['Name must be greater than 14 characters', ValidatorNames.MinLength, [{ requiredLength: 14 }, 'Name']],
    ['This field must be greater than 14 characters', ValidatorNames.MinLength, [{ requiredLength: 14 }, '']],
    ['Name is required with Surname', ValidatorNames.RequiredIfEquals, [{ sibling: 'Surname' }, 'Name']],
    ['This field is required with Surname', ValidatorNames.RequiredIfEquals, [{ sibling: 'Surname' }, '']],
    ['Notes is required', ValidatorNames.ValidateDefectNotes, undefined],
    ['foo', 'invalidTestResult', [{ message: 'foo' }]],
    ['Date must be in the past', ValidatorNames.PastDate, [true, 'Date']],
    ['This date must be in the past', ValidatorNames.PastDate, [true, undefined]]
  ])('should return "%s" for %s with %o', (expected, key, props) => {
    props ? expect(ErrorMessageMap[key](...props)).toBe(expected) : expect(ErrorMessageMap[key]()).toBe(expected);
  });
});
