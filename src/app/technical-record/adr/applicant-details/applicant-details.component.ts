import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { ApplicantDetails } from '@app/models/adr-details';

@Component({
  selector: 'vtm-applicant-details',
  templateUrl: './applicant-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicantDetailsComponent implements OnInit {
  @Input() edit: boolean;
  @Input() applicantDetails: ApplicantDetails;

  constructor() {}

  ngOnInit() {}
}
