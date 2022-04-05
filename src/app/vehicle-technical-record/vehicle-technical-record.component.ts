import { Component, Input } from '@angular/core';
import { TechRecord } from '../models/tech-record.model';
import { TestRecordService } from '../services/test-record-service/test-record.service';
import { TestResultModel } from '../models/test-result.model';
import { Observable} from 'rxjs';

// largely copied from  archive/../vehicle-summary.component.ts
@Component({
  selector: 'app-vehicle-technical-record',
  templateUrl: './vehicle-technical-record.component.html',
  styleUrls: ['./vehicle-technical-record.component.scss']
})
export class VehicleTechnicalRecordComponent{
  @Input() technicalRecord?: TechRecord;

  testRecordService: TestRecordService;
  record: Observable<TestResultModel[]>;

  constructor(testRecordService: TestRecordService) {
    this.testRecordService = testRecordService;
    this.record = this.testRecordService.getTestRecords("test");
  }

  get vehicleClassDescription(): string | undefined {
    return this.technicalRecord?.vehicleClass.description;
  }

  get isStandardVehicle(): boolean {
    return (
      'hgv' === this.technicalRecord?.vehicleType ||
      'trl' === this.technicalRecord?.vehicleType ||
      'psv' === this.technicalRecord?.vehicleType);
  }

  axlesHasParkingBrakeMrk(): boolean {
    return (
      this.technicalRecord != undefined &&
      this.technicalRecord.axles &&
      this.technicalRecord.axles.length > 0 &&
      this.technicalRecord.axles.some((x) => x.parkingBrakeMrk)
    );
  }


  // export enum VEHICLE_TYPES {
  //   PSV = 'psv',
  //   HGV = 'hgv',
  //   TRL = 'trl',
  //   Car = 'car',
  //   LGV = 'lgv',
  //   Moto = 'motorcycle'
  // }

}
