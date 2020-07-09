import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, ControlContainer, FormGroupDirective, FormBuilder } from '@angular/forms';

import { TechRecord, Brakes } from '@app/models/tech-record.model';
import { BOOLEAN_RADIO_OPTIONS } from '@app/technical-record/technical-record.constants';
import { VEHICLE_TYPES } from '@app/app.enums';

@Component({
  selector: 'vtm-brakes-edit',
  templateUrl: './brakes-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class BrakesEditComponent implements OnInit {
  @Input() techRecord: TechRecord;

  techRecordFg: FormGroup;
  trlVvehicleType: VEHICLE_TYPES.TRL;
  psvVvehicleType: VEHICLE_TYPES.PSV;
  booleanOptions = BOOLEAN_RADIO_OPTIONS;

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  ngOnInit() {
    const { brakes } = this.techRecord;
    const brakesDetails = !!brakes ? brakes : ({} as Brakes);

    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;

    this.techRecordFg.addControl(
      'brakesVT', // brake Vehicle Type
      this.fb.group({
        loadSensingValve: this.fb.control(
          brakesDetails.loadSensingValve
            ? brakesDetails.loadSensingValve
            : BOOLEAN_RADIO_OPTIONS.No
        ),
        antilockBrakingSystem: this.fb.control(
          brakesDetails.antilockBrakingSystem
            ? brakesDetails.antilockBrakingSystem
            : BOOLEAN_RADIO_OPTIONS.No
        )
      })
    );
  }

  unsorted(): number {
    return 0;
  }
}
