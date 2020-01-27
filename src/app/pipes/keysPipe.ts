import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value: { [x: string]: any; }, args?: string[]): any {
    const keys = [];

    console.log(value);

    let incr = 0;
    for (const key in value) {
      keys.push({ key: value[key].content, value: value[key].value, index: incr });
      incr++;
    }

    console.log(keys);

    return keys;
  }
}

