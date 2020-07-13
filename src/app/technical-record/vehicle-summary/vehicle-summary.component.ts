import {
  Component,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';

import { TechRecord } from '@app/models/tech-record.model';
import { TechRecordHelperService } from '../tech-record-helper.service';
import { VIEW_STATE } from '@app/app.enums';

@Component({
  selector: 'vtm-vehicle-summary',
  templateUrl: './vehicle-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleSummaryComponent implements OnChanges {
  @Input() activeRecord: TechRecord;
  @Input() editState: boolean;
  @Input() viewState: VIEW_STATE;

  vehicleClassDescription: string;
  isStandardVehicle: boolean;

  constructor(public techRecHelper: TechRecordHelperService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { activeRecord } = changes;

    if (activeRecord) {
      this.vehicleClassDescription =
        this.activeRecord.vehicleClass && this.activeRecord.vehicleClass.description
          ? this.activeRecord.vehicleClass.description
          : null;

      this.isStandardVehicle = this.techRecHelper.isStandardVehicle(
        this.activeRecord.vehicleType
      );
    }
  }

  axlesHasParkingBrakeMrk(): boolean {
    return (
      this.activeRecord.axles &&
      this.activeRecord.axles.length &&
      this.activeRecord.axles.some((x) => x.parkingBrakeMrk)
    );
  }
}
