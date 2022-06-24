import { Component, Input, OnDestroy } from '@angular/core';
import { TestResultModel } from '@models/test-result.model';
import { TechRecordModel, VehicleTechRecordModel, Vrm } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-vehicle-technical-record',
  templateUrl: './vehicle-technical-record.component.html'
})
export class VehicleTechnicalRecordComponent implements OnDestroy {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  currentTechRecord: Observable<TechRecordModel | undefined>;
  records: Observable<TestResultModel[]>;
  ngDestroy$ = new Subject();

  constructor(testRecordService: TestRecordsService, private technicalRecordService: TechnicalRecordService) {
    this.currentTechRecord = this.technicalRecordService.viewableTechRecord$(this.vehicleTechRecord!, this.ngDestroy$);
    this.records = testRecordService.testRecords$;
  }

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find((vrm) => vrm.isPrimary === true)?.vrm;
  }

  get otherVrms(): Vrm[] | undefined {
    return this.vehicleTechRecord?.vrms.filter((vrm) => vrm.isPrimary === false);
  }

  ngOnDestroy() {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }
}
