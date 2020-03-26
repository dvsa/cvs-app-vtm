import {Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';

@Component({
  selector: 'vtm-multiple-records',
  templateUrl: './multiple-records.component.html',
  styleUrls: ['./multiple-records.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleRecordsComponent implements OnInit {

  @Input() vehicleTechRecords: VehicleTechRecordModel[];
  @Output() setVehicleTechRecord = new EventEmitter<VehicleTechRecordModel>();


  constructor() {}

  ngOnInit() {}

  setSelectedVehicleTechRecord( vehicleTechRecord: VehicleTechRecordModel) {
    this.setVehicleTechRecord.emit(vehicleTechRecord);
  }
}
