import { Pipe, PipeTransform } from '@angular/core';
import { TechRecord } from '@app/models/tech-record.model';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';

@Pipe({ name: 'FilterMultipleRecords' })
export class FilterMultipleRecordsPipe implements PipeTransform {
  transform(multipleRecordsList: VehicleTechRecordModel[]): VehicleTechRecordModel[] {
    const vehicleTechnicalRecords = [...multipleRecordsList];

    vehicleTechnicalRecords.sort((a, b) => {
      const recordA = this.getRecord(a);
      const recordB = this.getRecord(b);

      if (recordA.make !== recordB.make) {
        return recordA.make.localeCompare(recordB.make);
      } else {
        return recordB.manufactureYear - recordA.manufactureYear;
      }
    });
    return vehicleTechnicalRecords;
  }

  getRecord(vehicleTechRecord: VehicleTechRecordModel): TechRecord {
    let record: TechRecord;

    record = vehicleTechRecord.techRecord.find(
      (tRec: TechRecord) => tRec.statusCode === 'current'
    );
    if (record !== undefined) {
      return record;
    }

    record = vehicleTechRecord.techRecord.find(
      (tRec: TechRecord) => tRec.statusCode === 'provisional'
    );
    if (record !== undefined) {
      return record;
    }

    record = vehicleTechRecord.techRecord
      .filter((tRec: TechRecord) => tRec.statusCode === 'archived')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    return record;
  }
}
