import { FormControl } from '@angular/forms';
import { DateValidators } from './date.validators';

describe(DateValidators.validDate.name, () => {
  it.each([
    [{ invalidDate: true }, 'asdasd'],
    [{ invalidDate: true }, '2000-01-00'],
    [{ invalidDate: true }, '2000--00'],
    [{ invalidDate: true }, '20'],
    [{ invalidDate: true }, '-01-00'],
    [{ invalidDate: true }, ''],
    [null, '2022-01-01'],
    [null, '2022-01'],
    [null, '2022'],
    [null, '2022-01-01T00:00:00.000Z']
  ])('should validate date and return %s for %p', (expected, date: string) => {
    const control = new FormControl(new Date(date));

    expect(DateValidators.validDate(control)).toEqual(expected);
  });
});
