import { Pipe, PipeTransform } from '@angular/core';
import { TechRecord } from '@app/models/tech-record.model';

@Pipe({ name: 'FilterMultipleRecords' })
export class FilterMultipleRecordsPipe implements PipeTransform {
  transform(multipleRecordsList: any): any {

    if (multipleRecordsList) {
      multipleRecordsList.forEach((techRecordList) => {

        if (techRecordList && !Array.isArray(techRecordList.techRecord[0])) {
          const isCurrent = techRecordList.techRecord.find(
            (record: TechRecord) => record.statusCode === 'current'
          );
          const isProvisional = techRecordList.techRecord.find(
            (record: TechRecord) => record.statusCode === 'provisional'
          );
          const isArchived = techRecordList.techRecord.filter(
            (record: TechRecord) => record.statusCode === 'archived'
          );

          if (!!isCurrent) {
            techRecordList.techRecord = [techRecordList.techRecord, isCurrent];
          } else if (isCurrent === undefined && !!isProvisional) {
            techRecordList.techRecord = [techRecordList.techRecord, isProvisional];
          } else if (
            isCurrent === undefined &&
            isProvisional === undefined &&
            isArchived.length > 0
          ) {
            isArchived.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            techRecordList.techRecord = [techRecordList.techRecord, isArchived[0]];
          }
        }
      });

      multipleRecordsList.sort((a, b) => {
        if (a.techRecord[1].make !== b.techRecord[1].make) {
          return a.techRecord[1].make.localeCompare(b.techRecord[1].make);
        } else {
          return b.techRecord[1].manufactureYear - a.techRecord[1].manufactureYear;
        }
      });
      return multipleRecordsList;
    }
  }
}
