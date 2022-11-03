import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'digitGroupSeparator'
})
export class DigitGroupSeparatorPipe implements PipeTransform {
  transform(value: number | undefined): string | undefined {
    if (value != undefined) {
      return value.toLocaleString();
    }
    return value;
  }
}
