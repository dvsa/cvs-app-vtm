import { Pipe, PipeTransform } from '@angular/core';
import { ReferenceDataTyreLoadIndex } from '@models/reference-data.model';

@Pipe({
  name: 'tyreAxleLoad'
})
export class TyreAxleLoadPipe implements PipeTransform {
  transform(
    axleLoad: string | undefined,
    index: string | undefined,
    factor: number,
    loadIndex: ReferenceDataTyreLoadIndex[]
  ): undefined | string | number {
    if (axleLoad) {
      return axleLoad;
    }
    const axleLoadIndex = loadIndex.find(resource => resource.resourceKey === index);
    return axleLoadIndex?.load_index ? String(+axleLoadIndex.load_index * factor) : undefined;
  }
}
