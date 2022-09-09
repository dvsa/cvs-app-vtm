import { Component, Input, OnInit } from '@angular/core';
import { Roles } from '@models/roles.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TechRecordModel, VehicleTechRecordModel, VehicleTypes, Vrm } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vehicle-technical-record',
  templateUrl: './vehicle-technical-record.component.html'
})
export class VehicleTechnicalRecordComponent implements OnInit {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  currentTechRecord$!: Observable<TechRecordModel | undefined>;
  records$: Observable<TestResultModel[]>;

  constructor(testRecordService: TestRecordsService, private technicalRecordService: TechnicalRecordService) {
    this.records$ = testRecordService.testRecords$;
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

  public get roles() {
    return Roles;
  }

  get vehicleTypes() {
    return VehicleTypes;
  }
}
