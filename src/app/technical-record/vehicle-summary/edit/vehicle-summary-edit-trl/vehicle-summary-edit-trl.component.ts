import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroupDirective, FormBuilder, FormGroup, ControlContainer } from '@angular/forms';

import { TechRecord } from '@app/models/tech-record.model';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';
import {
  FRAME_DESCRIPTION,
  SUSPENSION_TYPE_OPTIONS
} from '@app/technical-record/technical-record.constants';

@Component({
  selector: 'vtm-vehicle-summary-edit-trl',
  templateUrl: './vehicle-summary-edit-trl.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class VehicleSummaryEditTrlComponent implements OnInit {
  @Input() techRecord: TechRecord;

  techRecordFg: FormGroup;
  frameDescriptionOptions = new DisplayOptionsPipe().transform(FRAME_DESCRIPTION);
  suspensionTypeOptions = SUSPENSION_TYPE_OPTIONS;

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  ngOnInit() {
    this.techRecordFg = this.parent.form as FormGroup;

    this.techRecordFg.addControl('firstUseDate', this.fb.control(this.techRecord.firstUseDate));
    this.techRecordFg.addControl(
      'suspensionType',
      this.fb.control(this.techRecord.suspensionType)
    );
    this.techRecordFg.addControl('couplingType', this.fb.control(this.techRecord.couplingType));
    this.techRecordFg.addControl(
      'maxLoadOnCoupling',
      this.fb.control(this.techRecord.maxLoadOnCoupling)
    );
    this.techRecordFg.addControl(
      'frameDescription',
      this.fb.control(this.techRecord.frameDescription)
    );
  }

  unsorted(): number {
    return 0;
  }
}
