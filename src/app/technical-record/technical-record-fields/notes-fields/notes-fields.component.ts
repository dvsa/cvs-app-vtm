import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TechnicalRecordFieldsComponent } from '../technical-record-fields.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'vtm-notes-fields',
  templateUrl: './notes-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesFieldsComponent extends TechnicalRecordFieldsComponent implements OnInit {
  technicalRecord: FormGroup;

  ngOnInit() {
    this.technicalRecord = super.setUp();

    this.technicalRecord.addControl('notes', this.fb.control(''));
  }
}
