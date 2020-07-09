import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, ControlContainer, FormGroupDirective, FormBuilder } from '@angular/forms';

import { PurchaserDetails } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-purchaser-edit',
  templateUrl: './purchaser-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class PurchaserEditComponent implements OnInit {
  @Input() purchaser: PurchaserDetails;

  techRecordFg: FormGroup;

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  get purchaserDetails() {
    return this.techRecordFg.get('purchaserDetails') as FormGroup;
  }

  ngOnInit() {
    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;

    const pcrDetails: PurchaserDetails = !!this.purchaser
      ? this.purchaser
      : ({} as PurchaserDetails);

    this.techRecordFg.addControl(
      'purchaserDetails',
      this.fb.group({
        name: this.fb.control(pcrDetails.name),
        address1: this.fb.control(pcrDetails.address1),
        address2: this.fb.control(pcrDetails.address2),
        postTown: this.fb.control(pcrDetails.postTown),
        address3: this.fb.control(pcrDetails.address3),
        postCode: this.fb.control(pcrDetails.postCode),
        telephoneNumber: this.fb.control(pcrDetails.telephoneNumber),
        emailAddress: this.fb.control(pcrDetails.emailAddress),
        faxNumber: this.fb.control(pcrDetails.faxNumber),
        purchaserNotes: this.fb.control(pcrDetails.purchaserNotes)
      })
    );
  }
}
