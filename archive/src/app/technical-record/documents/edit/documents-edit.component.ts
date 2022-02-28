import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, ControlContainer, FormGroupDirective, FormBuilder } from '@angular/forms';

import { MICROFILM_DOCUMENT_TYPE } from '@app/technical-record/technical-record.constants';

import { SelectOption } from '@app/models/select-option';
import { Microfilm } from '@app/models/tech-record.model';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';

@Component({
  selector: 'vtm-documents-edit',
  templateUrl: './documents-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class DocumentsEditComponent implements OnInit {
  @Input() microfilmDetails: Microfilm;
  techRecordFg: FormGroup;
  microfilmDocumentTypeOptions: SelectOption[];

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  ngOnInit() {
    this.microfilmDocumentTypeOptions = new DisplayOptionsPipe().transform(
      MICROFILM_DOCUMENT_TYPE
    );

    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;

    const microfilms: Microfilm = !!this.microfilmDetails
      ? this.microfilmDetails
      : ({} as Microfilm);

    this.techRecordFg.addControl(
      'microfilm',
      this.fb.group({
        microfilmDocumentType: this.fb.control(microfilms.microfilmDocumentType),
        microfilmRollNumber: this.fb.control(microfilms.microfilmRollNumber),
        microfilmSerialNumber: this.fb.control(microfilms.microfilmSerialNumber)
      })
    );
  }
}
