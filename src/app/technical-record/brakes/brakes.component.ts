import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Brakes, Axle, TechRecord } from '@app/models/tech-record.model';
import { VEHICLE_TYPES } from '@app/app.enums';

@Component({
  selector: 'vtm-brakes',
  templateUrl: './brakes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrakesComponent implements OnChanges {
  @Input() techRecord: TechRecord;
  @Input() editState: boolean;

  brakes: Brakes;
  axles: Axle[];
  trlVvehicleType: VEHICLE_TYPES.TRL;
  psvVvehicleType: VEHICLE_TYPES.PSV;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const { techRecord } = changes;

    if (techRecord) {
      this.brakes = !!this.techRecord.brakes ? this.techRecord.brakes : ({} as Brakes);
      this.axles = this.techRecord.axles ? this.techRecord.axles : ([] as Axle[]);
    }
  }
}
