import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TechnicalRecordFieldsComponent } from '../technical-record-fields.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'vtm-documents-fields',
  templateUrl: './documents-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsFieldsComponent extends TechnicalRecordFieldsComponent implements OnInit {
  technicalRecord: FormGroup;
  microfilmDocumentTypeOption = {};

  ngOnInit() {
    this.technicalRecord = super.setUp();

    this.technicalRecord.addControl(
      'microfilm',
      this.fb.group({
        microfilmDocumentType: this.fb.control('microfilmDocumentType'),
        microfilmRollNumber: this.fb.control('microfilmRollNumber'),
        microfilmSerialNumber: this.fb.control('microfilmSerialNumber')
      })
    );
  }
}
