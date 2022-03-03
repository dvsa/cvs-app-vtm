import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'DefaultNullOrEmpty' })
export class DefaultNullOrEmpty implements PipeTransform {
  transform(value: any): any {
    if (typeof value === 'string') {
      return value.trim().length > 0 ? value : '-';
    } else if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    } else {
      return value == null ? '-' : value;
    }
  }
}
