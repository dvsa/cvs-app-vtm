import { FormControl } from '@angular/forms';
import { CustomValidators } from './date.validators';

describe(CustomValidators.validDate.name, () => {
  it.each([
    [{ invalidDate: true }, 'asdasd'],
    [{ invalidDate: true }, '2000-01-00'],
    [{ invalidDate: true }, '2000--00'],
    [{ invalidDate: true }, '20'],
    [{ invalidDate: true }, '-01-00'],
    [{ invalidDate: true }, ''],
    [null, '2022-01-01'],
    [null, '2022-01'],
    [null, '2022']
  ])('should validate date and return %s for %p', (expected, date) => {
    const control = new FormControl(new Date(date));

    expect(CustomValidators.validDate(control)).toEqual(expected);
  });
});
