import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'DisplayByDelimiter' })
export class DisplayByDelimiter implements PipeTransform {
  transform(strings: (number | string)[], delimiter: string): string {
    const stringsToJoin = strings.length > 1 ? strings.filter((item) => item) : [''];
    return stringsToJoin.join(delimiter);
  }
}
