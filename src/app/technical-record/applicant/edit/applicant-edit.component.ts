import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, ControlContainer, FormGroupDirective, FormBuilder } from '@angular/forms';

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

  techRecordFg: FormGroup;

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  get applicantDetails() {
    return this.techRecordFg.get('applicantDetails') as FormGroup;
  }

  ngOnInit() {
    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;

    const applicantdDetails: Applicant = !!this.applicant ? this.applicant : ({} as Applicant);

    this.techRecordFg.addControl(
      'applicantDetails',
      this.fb.group({
        name: this.fb.control(applicantdDetails.name),
        address1: this.fb.control(applicantdDetails.address1),
        address2: this.fb.control(applicantdDetails.address2),
        postTown: this.fb.control(applicantdDetails.postTown),
        address3: this.fb.control(applicantdDetails.address3),
        postCode: this.fb.control(applicantdDetails.postCode),
        telephoneNumber: this.fb.control(applicantdDetails.telephoneNumber),
        emailAddress: this.fb.control(applicantdDetails.emailAddress)
      })
    );
  }
}
