import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TechnicalRecordFieldsComponent } from '../technical-record-fields.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'vtm-dimensions-fields',
  templateUrl: './dimensions-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionsFieldsComponent extends TechnicalRecordFieldsComponent implements OnInit {
  technicalRecord: FormGroup;

  ngOnInit() {
    this.technicalRecord = super.setUp();

    this.technicalRecord.addControl('frontAxleToRearAxle', this.fb.control(''));
    this.technicalRecord.addControl('frontAxleTo5thWheelCouplingMin', this.fb.control(''));
    this.technicalRecord.addControl('frontAxleTo5thWheelCouplingMax', this.fb.control(''));
    this.technicalRecord.addControl('frontAxleTo5thWheelMin', this.fb.control(''));
    this.technicalRecord.addControl('frontAxleTo5thWheelMax', this.fb.control(''));

    this.technicalRecord.addControl(
      'dimensions',
      this.fb.group({
        length: this.fb.control('length'),
        width: this.fb.control('width')
        // add another layer for axleSpacing
      })
    );
  }
}
