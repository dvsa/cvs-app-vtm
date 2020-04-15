import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { Applicant } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-applicant',
  templateUrl: './applicant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicantComponent implements OnInit {
  @Input() editState: boolean;
  @Input() applicantDetails: Applicant;
  address1And2 = '';

  constructor() {}

  ngOnInit() {
    if (this.applicantDetails) {
      this.address1And2 = `${this.applicantDetails.address1} ${this.applicantDetails.address2}`;
    }
  }
}
