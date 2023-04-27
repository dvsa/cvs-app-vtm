import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tyreAxleLoad'
})
export class TyreAxleLoadPipe implements PipeTransform {
  transform(axleLoad: string | undefined, index: string | undefined, factor: number): undefined | string {
    if (axleLoad) {
      return axleLoad;
    }
    return index ? String(+index * factor) : undefined;
  }
}
