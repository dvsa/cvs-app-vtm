import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'DefaultNullOrEmpty' })
export class DefaultNullOrEmpty implements PipeTransform {
  transform(value: any): any {
    switch (typeof value) {
      case 'string':
        if (value.trim().length > 0) {
          if (
            /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value) ||
            /(\d{4})-(\d{2})-(\d{2})/.test(value)
          ) {
            const checkDate = new Date(value);
            if (checkDate.toISOString() === value) {
              return (
                checkDate.getDate() +
                '/' +
                ('0' + (checkDate.getMonth() + 1)).slice(-2) +
                '/' +
                checkDate.getFullYear()
              );
            } else {
              const dateArray = value.split('-');
              return dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0];
            }
          } else {
            return value;
          }
        } else {
          return '-';
        }
        break;
      case 'boolean':
        return value ? 'Yes' : 'No';
        break;
      default:
        return value == null ? '-' : value;
    }
  }
}
