import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'SortByDatePipe' })
export class SortByDatePipe implements PipeTransform {
  transform(listToSort: any, sortBy: string): any {
    if (listToSort) {
      return listToSort.sort(
        (a, b) => new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime()
      );
    }
  }
}
