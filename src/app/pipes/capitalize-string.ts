import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'CapitalizeString' })
export class CapitalizeString implements PipeTransform {
  transform(string: string): string {
    return string.length > 0
      ? string.charAt(0).toUpperCase() + string.substr(1).toLowerCase()
      : '';
  }
}
