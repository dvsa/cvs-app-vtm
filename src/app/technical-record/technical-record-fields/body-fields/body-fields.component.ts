import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TechnicalRecordFieldsComponent } from '../technical-record-fields.component';

@Component({
  selector: 'vtm-body-fields',
  templateUrl: './body-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyFieldsComponent extends TechnicalRecordFieldsComponent implements OnInit {
  technicalRecord: FormGroup;
  functionCodeOption = { ['Articulated']: 'a', ['Rigid']: 'r' };
  bodyTypeOption = {
    ['Articulated']: 'a',
    ['Single decker']: 's',
    ['Double decker']: 'd',
    ['Other']: 'o',
    ['Petrol/Oil tanker']: 'x',
    ['Skeletal']: 'p',
    ['Tipper']: 'k',
    ['Box']: 't',
    ['Flat']: 'b',
    ['Refuse']: 'f',
    ['Skip loader']: 'r',
    ['Refrigerated']: 'c'
  };

  ngOnInit() {
    this.technicalRecord = super.setUp();

    this.technicalRecord.addControl('make', this.fb.control(''));
    this.technicalRecord.addControl('model', this.fb.control(''));

    this.technicalRecord.addControl(
      'body',
      this.fb.group({
        bodyType: this.fb.control('bodyType')
      })
    );

    this.technicalRecord.addControl('functionCode', this.fb.control(''));
    this.technicalRecord.addControl('conversionRefNo', this.fb.control(''));
  }
}
