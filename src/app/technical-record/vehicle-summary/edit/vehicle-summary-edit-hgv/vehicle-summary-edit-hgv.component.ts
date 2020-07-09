import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroupDirective, FormBuilder, FormGroup, ControlContainer } from '@angular/forms';

import { TechRecord } from '@app/models/tech-record.model';
import {
  BOOLEAN_RADIO_OPTIONS,
  FUEL_PROPULSION
} from '@app/technical-record/technical-record.constants';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';

@Component({
  selector: 'vtm-vehicle-summary-edit-hgv',
  templateUrl: './vehicle-summary-edit-hgv.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class VehicleSummaryEditHgvComponent implements OnInit {
  @Input() techRecord: TechRecord;

  techRecordFg: FormGroup;
  booleanOptions = BOOLEAN_RADIO_OPTIONS;
  fuelPropulsionOptions = new DisplayOptionsPipe().transform(FUEL_PROPULSION);

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  ngOnInit() {
    this.techRecordFg = this.parent.form as FormGroup;

    this.techRecordFg.addControl(
      'speedLimiterMrk',
      this.fb.control(
        this.techRecord.speedLimiterMrk
          ? this.techRecord.speedLimiterMrk
          : BOOLEAN_RADIO_OPTIONS.No
      )
    );

    this.techRecordFg.addControl(
      'tachoExemptMrk',
      this.fb.control(
        this.techRecord.tachoExemptMrk ? this.techRecord.tachoExemptMrk : BOOLEAN_RADIO_OPTIONS.No
      )
    );

    this.techRecordFg.addControl('euroStandard', this.fb.control(this.techRecord.euroStandard));

    this.techRecordFg.addControl(
      'fuelPropulsionSystem',
      this.fb.control(this.techRecord.fuelPropulsionSystem)
    );

    this.techRecordFg.addControl(
      'drawbarCouplingFitted',
      this.fb.control(
        this.techRecord.drawbarCouplingFitted
          ? this.techRecord.drawbarCouplingFitted
          : BOOLEAN_RADIO_OPTIONS.No
      )
    );

    this.techRecordFg.addControl(
      'offRoad',
      this.fb.control(
        this.techRecord.offRoad ? this.techRecord.offRoad : BOOLEAN_RADIO_OPTIONS.No
      )
    );

    this.techRecordFg.addControl(
      'numberOfWheelsDriven',
      this.fb.control(this.techRecord.numberOfWheelsDriven)
    );

    this.techRecordFg.addControl(
      'emissionsLimit',
      this.fb.control(this.techRecord.emissionsLimit)
    );
  }

  unsorted(): number {
    return 0;
  }
}
