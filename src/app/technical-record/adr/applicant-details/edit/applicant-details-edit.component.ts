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

  super() {}

  ngOnInit(): void {
    this.adrForm = super.setUp();

    this.adrForm.addControl(
      'applicantDetails',
      this.fb.group({
        name: this.fb.control(this.applicantDetails.name),
        street: this.fb.control(this.applicantDetails.street),
        town: this.fb.control(this.applicantDetails.town),
        city: this.fb.control(this.applicantDetails.city),
        postcode: this.fb.control(this.applicantDetails.postcode)
      })
    );
  }
}
