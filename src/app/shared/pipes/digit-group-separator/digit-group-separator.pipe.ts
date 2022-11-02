import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'digitGroupSeparator'
})
export class DigitGroupSeparatorPipe implements PipeTransform {
  transform(value: number | undefined): string {
    if (value !== undefined && value !== null) {
      return value.toLocaleString();
    } else {
      return '';
    }
  }
}
