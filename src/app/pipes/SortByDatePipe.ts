import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'SortByDatePipe'})

export class SortByDatePipe implements PipeTransform {

  transform(testResultList: any, sortBy: any): any {
    if (testResultList) {
      return testResultList.sort((a, b) => new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime());
    }
  }

}
