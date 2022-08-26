import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TechRecordModel, VehicleTechRecordModel, Vrm } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable, Subject } from 'rxjs';
import { Roles } from '@models/roles.enum';
import { TestResultModel } from '@models/test-results/test-result.model';

@Component({
  selector: 'app-vehicle-technical-record',
  templateUrl: './vehicle-technical-record.component.html'
})
export class VehicleTechnicalRecordComponent implements OnInit, OnDestroy {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  currentTechRecord$?: Observable<TechRecordModel | undefined>;
  records: Observable<TestResultModel[]>;
  ngDestroy$ = new Subject();

  constructor(testRecordService: TestRecordsService, private technicalRecordService: TechnicalRecordService) {
    this.records = testRecordService.testRecords$;
  }

  ngOnInit(): void {
    this.currentTechRecord$ = this.technicalRecordService.viewableTechRecord$(this.vehicleTechRecord!);
  }

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  get otherVrms(): Vrm[] | undefined {
    return this.vehicleTechRecord?.vrms.filter(vrm => vrm.isPrimary === false);
  }

  ngOnDestroy() {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }

  public get Roles() {
    return Roles;
  }
}
