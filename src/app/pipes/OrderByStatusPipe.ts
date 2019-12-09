import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'OrderByStatusPipe' })

export class OrderByStatusPipe implements PipeTransform {

  transform(techRecordList: any): any {
    if (techRecordList) {
      let orderedTechRec = [];
      let records = techRecordList.find((record: any) => record.statusCode === 'current');
      if (records !== undefined) orderedTechRec.push(records);

      records = techRecordList.find((record: any) => record.statusCode === 'provisional');
      if (records !== undefined) orderedTechRec.push(records);

      records = techRecordList.filter((record: any) => record.statusCode === 'archived');
      records.sort((a,b)=> new Date (a.createdAt).getTime() - new Date (b.createdAt).getTime() );
      if (records !== undefined) records.forEach(element => orderedTechRec.push(element));

      return orderedTechRec;

    }
  }

}
