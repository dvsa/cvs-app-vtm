import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';

@Component({
  selector: 'vtm-multiple-records',
  templateUrl: './multiple-records.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleRecordsComponent implements OnInit {
  @Input() vehicleTechRecords: VehicleTechRecordModel[];
  @Output() setVehicleTechRecord = new EventEmitter<VehicleTechRecordModel>();

  constructor() {}

  ngOnInit() {}

  setSelectedVehicleTechRecord(vehicleTechRecord: VehicleTechRecordModel) {
    this.setVehicleTechRecord.emit(vehicleTechRecord);
  }
}
