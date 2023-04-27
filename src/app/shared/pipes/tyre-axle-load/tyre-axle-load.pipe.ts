import { Pipe, PipeTransform } from '@angular/core';
import { ReferenceDataTyre } from '@models/reference-data.model';

@Pipe({
  name: 'tyreAxleLoad'
})
export class TyreAxleLoadPipe implements PipeTransform {
  transform(axleLoad: string | undefined, index: string | undefined, factor: number): undefined | string {
    if (axleLoad) {
      return axleLoad;
    }
    const calculatedValue = index ? +index * factor : undefined;
    return calculatedValue?.toString();
  }
}
