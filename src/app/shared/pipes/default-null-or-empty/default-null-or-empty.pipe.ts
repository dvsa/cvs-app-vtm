import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'defaultNullOrEmpty' })
export class DefaultNullOrEmpty implements PipeTransform {
  titleCaseFirstWord(value: string) {
    return value[0].toUpperCase() + value.substring(1);
  }

  transform(value: any): any {
    if (typeof value === 'string') {
      return value.trim().length > 0 ? this.titleCaseFirstWord(value) : '-';
    } else if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    } else {
      return value == null ? '-' : value;
    }
  }
}
