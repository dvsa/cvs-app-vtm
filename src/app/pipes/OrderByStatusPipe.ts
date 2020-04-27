import { Pipe, PipeTransform } from '@angular/core';
import { TechRecord } from '@app/models/tech-record.model';

@Pipe({ name: 'OrderByStatusPipe' })

export class OrderByStatusPipe implements PipeTransform {

  transform(techRecordList: TechRecord[]): TechRecord[] {
    if (techRecordList) {
      const orderedTechRec = [];
      let records: TechRecord = techRecordList.find((record: TechRecord) => record.statusCode === 'current');
      if (records !== undefined) { orderedTechRec.push(records); }

      records = techRecordList.find((record: TechRecord) => record.statusCode === 'provisional');
      if (records !== undefined) { orderedTechRec.push(records); }

     const archivedRecords: TechRecord[] = techRecordList.filter((record: TechRecord) => record.statusCode === 'archived');
      archivedRecords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (archivedRecords !== undefined) { archivedRecords.forEach(element => orderedTechRec.push(element)); }

      return orderedTechRec;

    }
  }

}
