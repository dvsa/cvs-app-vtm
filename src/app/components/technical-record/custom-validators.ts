import {FormControl} from '@angular/forms';

export class CustomValidators {

  static dateValidator(control: FormControl): { [key: string]: boolean } {

    const day = control.get('day');
    const month = control.get('month');
    const year = control.get('year');

    const date = day + ' ' + month + ' ' + year;

    if (date && typeof date === 'string') {
      const match = date.match(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/);
      if (!match) {
        return {'dateInvalid': true};
      } else if (match && match[0] !== date) {
        return {'dateInvalid': true};
      }
    }
    return null;
  }

}
