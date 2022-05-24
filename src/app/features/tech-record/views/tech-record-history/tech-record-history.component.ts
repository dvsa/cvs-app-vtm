import { Component, Input } from '@angular/core';
import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-tech-record-history',
  templateUrl: './tech-record-history.component.html',
  styleUrls: ['./tech-record-history.component.scss']
})
export class TechRecordHistoryComponent {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  @Input() currentRecord?: TechRecordModel;

  constructor() { }

  convertToUnix(date: Date): number {
    return new Date(date).getTime()
  }

}
