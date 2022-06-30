import { ErrorMessageMap } from './error-message-map';

describe('ErrorMessageMap', () => {
  it.each([
    ['This field is required', 'required', [true, '']],
    ['This field is required', 'required', [true, undefined]],
    ['This field is required', 'required', [true, null]],
    ['Name is required', 'required', [true, 'Name']],
    ['This field must match a pattern', 'pattern', [true, '']],
    ['Name must match a pattern', 'pattern', [true, 'Name']],
    ['This field must match pattern xxx', 'customPattern', [{ message: 'must match pattern xxx' }, '']],
    ['Name must match pattern xxx', 'customPattern', [{ message: 'must match pattern xxx' }, 'Name']],
    ['This field is an invalid date', 'invalidDate', [true, '']],
    ['Name is an invalid date', 'invalidDate', [true, 'Name']]
  ])('should return "%s" for %s with %o', (expected, key, props) => {
    expect(ErrorMessageMap[key](...props)).toBe(expected);
  });
});
