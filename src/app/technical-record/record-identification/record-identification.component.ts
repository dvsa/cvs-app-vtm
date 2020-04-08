import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { VehicleTechRecordModel } from './../../models/vehicle-tech-record.model';
import { VrmModel } from '@app/models/vrm.model';

@Component({
  selector: 'vtm-record-identification',
  templateUrl: './record-identification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordIdentificationComponent implements OnInit {
  @Input() vehicleModel: VehicleTechRecordModel;
  @Input() canEdit: boolean;

  constructor() {}

  ngOnInit() {}

  hasSecondaryVrms(vrms: VrmModel[]) {
    return vrms && vrms.length > 1 && vrms.filter((vrm) => vrm.isPrimary === false).length > 0;
  }
}
