import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

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
        name: this.fb.control(details.name),
        street: this.fb.control(details.street),
        town: this.fb.control(details.town),
        city: this.fb.control(details.city),
        postcode: this.fb.control(details.postcode)
      })
    );
  }
}
