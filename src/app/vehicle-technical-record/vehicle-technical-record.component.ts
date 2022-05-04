import { Component, Input } from '@angular/core';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable, of } from 'rxjs';
import { TestResultModel } from '../models/test-result.model';
import { VehicleTechRecordModel, Vrm } from '../models/vehicle-tech-record.model';

@Component({
  selector: 'app-vehicle-technical-record',
  templateUrl: './vehicle-technical-record.component.html',
  styleUrls: ['./vehicle-technical-record.component.scss']
})
export class VehicleTechnicalRecordComponent {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;

  records: Observable<TestResultModel[]> = of([]);

  constructor(testRecordService: TestRecordsService) {
    this.records = testRecordService.testRecords$;
  }

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find((vrm) => vrm.isPrimary === true)?.vrm;
  }

  get otherVrms(): vrm[] | undefined {
    return this.vehicleTechRecord?.vrms.filter((vrm) => vrm.isPrimary === false);
  }
}
