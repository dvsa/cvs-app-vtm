import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { VehicleTechRecordEdit } from '@app/models/vehicle-tech-record.model';

@Component({
  selector: 'vtm-record-identification',
  templateUrl: './record-identification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordIdentificationComponent implements OnInit {
  @Input() vehicleTechRecord: VehicleTechRecordEdit;
  @Input() editState: boolean;

  isTrailer: boolean | string;

  constructor() {}

  ngOnInit() {
    this.isTrailer = this.vehicleTechRecord.trailerId || false;
  }
}
