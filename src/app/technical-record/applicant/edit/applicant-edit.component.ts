import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { FormGroup, ControlContainer, FormGroupDirective, FormBuilder } from '@angular/forms';

import { AddressFormComponent } from '@app/technical-record/shared/address-form/address-form.component';

import { Applicant } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-applicant-edit',
  templateUrl: './applicant-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class ApplicantEditComponent implements OnInit {
  @Input() applicant: Applicant;
  @ViewChild(AddressFormComponent) commonAddressForm: AddressFormComponent;

  techRecordFg: FormGroup;

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  get applicantDetails() {
    return this.techRecordFg.get('applicantDetails') as FormGroup;
  }

  ngOnInit() {
    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;

    const applicantDetails: Applicant = !!this.applicant ? this.applicant : ({} as Applicant);

    const { name, ...addressInfo } = applicantDetails;

    const commonAddressFields = this.commonAddressForm.createControls(addressInfo);

    this.techRecordFg.addControl(
      'applicantDetails',
      this.fb.group({
        name: this.fb.control(applicantDetails.name),
        ...commonAddressFields
      })
    );
  }
}
