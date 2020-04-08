import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TechnicalRecordFieldsComponent } from '../technical-record-fields.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'vtm-tyres-fields',
  templateUrl: './tyres-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TyresFieldsComponent extends TechnicalRecordFieldsComponent implements OnInit {
  technicalRecord: FormGroup;

  ngOnInit() {
    this.technicalRecord = super.setUp();

    this.technicalRecord.addControl('tyreUseCode', this.fb.control(''));
  }

  buildGroup(): FormGroup {
    return this.fb.group({
      tyres: this.fb.group({
        tyreCode: this.fb.control('tyreCode'),
        tyreSize: this.fb.control('tyreSize'),
        plyRating: this.fb.control('plyRating'),
        fitmentCode: this.fb.control('fitmentCode'),
        dataTrAxles: this.fb.control('dataTrAxels')
      })
    });
  }
}
