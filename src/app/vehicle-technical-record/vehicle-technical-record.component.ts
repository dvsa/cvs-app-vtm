import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { TestResultModel } from '../models/test-result.model';
import { VehicleTechRecordModel } from '../models/vehicle-tech-record.model';
import { TestRecordService } from '../services/test-record-service/test-record.service';

@Component({
  selector: 'app-vehicle-technical-record',
  templateUrl: './vehicle-technical-record.component.html',
  styleUrls: ['./vehicle-technical-record.component.scss']
})
export class VehicleTechnicalRecordComponent {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;

  testRecordService: TestRecordService;
  record: Observable<TestResultModel[]>;

  constructor(testRecordService: TestRecordService) {
    this.testRecordService = testRecordService;
    this.record = this.testRecordService.getTestRecords('test');
  }

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find((vrm) => vrm.isPrimary)?.vrm;
  }
}
