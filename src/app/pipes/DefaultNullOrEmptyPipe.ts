import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'DefaultNullOrEmpty' })
export class DefaultNullOrEmpty implements PipeTransform {
  transform(value: any): any {
    switch (typeof value) {
      case 'string':
        if (value.trim().length > 0) {
          return value;
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
