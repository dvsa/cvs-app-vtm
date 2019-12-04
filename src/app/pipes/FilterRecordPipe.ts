import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'FilterRecord'})
export class FilterRecordPipe implements PipeTransform {

  transform(techRecordList: any): any {
    if (techRecordList) {
      let records = techRecordList.find((record: any) => record.statusCode === 'current');
      if (records !== undefined) return records;

      records = techRecordList.find((record: any) => record.statusCode === 'provisional');
      if (records !== undefined) return records;

      records = techRecordList.find((record: any) => record.statusCode === 'archived');
      if (records !== undefined) return records;
    }
  }
}
