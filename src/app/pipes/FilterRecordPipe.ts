import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'FilterRecord'})
export class FilterRecordPipe implements PipeTransform {

  transform(techRecordList: any): any {
      console.log(`received techRecordList with length => ${techRecordList.length}`)
    if (techRecordList) {
      let records = techRecordList.find((record: any) => record.statusCode === 'current');
      console.log(`search current => ${JSON.stringify(records)}`);
      console.log(`search current records !== undefined => ${records !== undefined}`);
      console.log(`search current records != undefined => ${records != undefined}`);
      if (records !== undefined) return records;

      records = techRecordList.find((record: any) => record.statusCode === 'provisional');
      if (records !== undefined) return records;

      records = techRecordList.find((record: any) => record.statusCode === 'archived');
      if (records !== undefined) return records;
    }
  }
}
