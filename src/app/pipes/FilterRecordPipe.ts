import {Pipe, PipeTransform} from '@angular/core';
import {TechnicalRecordService} from "@app/technical-record-search/technical-record.service";

@Pipe({name: 'FilterRecord'})
export class FilterRecordPipe implements PipeTransform {

  constructor(private techRecordService: TechnicalRecordService) {
  }

  transform(techRecordList: any): any {
    this.techRecordService.getActiveTechRecord(techRecordList);
  }

}
