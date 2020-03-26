import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { AdrComponent } from '@app/technical-record/adr/adr.component';
import { ApplicantDetails } from '@app/models/adr-details';

@Component({
  selector: 'vtm-applicant-details-edit',
  templateUrl: './applicant-details-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicantDetailsEditComponent extends AdrComponent implements OnInit {
  adrForm: FormGroup;

  @Input() applicantDetails: ApplicantDetails;

  ngOnInit(): void {
    this.adrForm = super.setUp();

    const details: ApplicantDetails = !!this.applicantDetails
      ? this.applicantDetails
      : ({} as ApplicantDetails);

    this.adrForm.addControl(
      'applicantDetails',
      this.fb.group({
        name: this.fb.control(details.name, [Validators.required]),
        street: this.fb.control(details.street, [Validators.required]),
        town: this.fb.control(details.town, [Validators.required]),
        city: this.fb.control(details.city, [Validators.required]),
        postcode: this.fb.control(details.postcode, [Validators.required])
      })
    );
  }
}
