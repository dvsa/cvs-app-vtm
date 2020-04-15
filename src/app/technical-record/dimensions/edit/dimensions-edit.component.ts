import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormGroupDirective, FormBuilder } from '@angular/forms';

import { TechRecord, Dimensions } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-dimensions-edit',
  templateUrl: './dimensions-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionsEditComponent implements OnInit {
  @Input() techRecord: TechRecord;

  techRecordFg: FormGroup;

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  ngOnInit() {
    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;

    const dimensions: Dimensions = this.techRecord.dimensions
      ? this.techRecord.dimensions
      : ({} as Dimensions);

    this.techRecordFg.addControl(
      'dimensions',
      this.fb.group({
        length: this.fb.control(dimensions.length),
        width: this.fb.control(dimensions.width)
      })
    );
    this.techRecordFg.addControl(
      'frontAxleToRearAxle',
      this.fb.control(this.techRecord.frontAxleToRearAxle)
    );
    this.techRecordFg.addControl(
      'frontAxleTo5thWheelCouplingMin',
      this.fb.control(this.techRecord.frontAxleTo5thWheelCouplingMin)
    );
    this.techRecordFg.addControl(
      'frontAxleTo5thWheelCouplingMax',
      this.fb.control(this.techRecord.frontAxleTo5thWheelCouplingMax)
    );
    this.techRecordFg.addControl(
      'frontAxleTo5thWheelMin',
      this.fb.control(this.techRecord.frontAxleTo5thWheelMin)
    );
    this.techRecordFg.addControl(
      'frontAxleTo5thWheelMax',
      this.fb.control(this.techRecord.frontAxleTo5thWheelMax)
    );
  }
}
