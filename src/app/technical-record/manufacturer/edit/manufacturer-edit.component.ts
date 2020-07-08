import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, ControlContainer, FormGroupDirective, FormBuilder } from '@angular/forms';

import { ManufacturerDetails } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-manufacturer-edit',
  templateUrl: './manufacturer-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class ManufacturerEditComponent implements OnInit {
  @Input() manufacturerEditDetails: ManufacturerDetails;

  techRecordFg: FormGroup;

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  get manufacturerDetails() {
    return this.techRecordFg.get('manufacturerDetails') as FormGroup;
  }

  ngOnInit() {
    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;

    const manufDetails: ManufacturerDetails = !!this.manufacturerEditDetails
      ? this.manufacturerEditDetails
      : ({} as ManufacturerDetails);

    this.techRecordFg.addControl(
      'manufacturerDetails',
      this.fb.group({
        name: this.fb.control(manufDetails.name),
        address1: this.fb.control(manufDetails.address1),
        address2: this.fb.control(manufDetails.address2),
        postTown: this.fb.control(manufDetails.postTown),
        address3: this.fb.control(manufDetails.address3),
        postCode: this.fb.control(manufDetails.postCode),
        telephoneNumber: this.fb.control(manufDetails.telephoneNumber),
        emailAddress: this.fb.control(manufDetails.emailAddress),
        faxNumber: this.fb.control(manufDetails.faxNumber),
        manufacturerNotes: this.fb.control(manufDetails.manufacturerNotes)
      })
    );
  }
}
