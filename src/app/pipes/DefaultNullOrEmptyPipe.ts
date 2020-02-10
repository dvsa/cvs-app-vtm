import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'DefaultNullOrEmpty'})
export class DefaultNullOrEmpty implements PipeTransform {

  transform(value: any): any {

    switch (typeof value) {
      case 'string':
        if (value.trim().length > 0) {

          if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) {
            return value;
          }
          const checkDate = new Date(value);

          if (checkDate.toISOString() === value) {
            return checkDate.getDate() + '/' + checkDate.getMonth() + '/' + checkDate.getFullYear();
          }

        } else {
          return '-';
        }
        break;
      case 'boolean':
        return (value == null) ? '-' : (value ? 'Yes' : 'No');
        break;
      default:
        return (value == null) ? '-' : value;
    }

  }

}
