import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';

import { ApplicantDetails, AdrDetails } from '@app/models/adr-details';

@Component({
  selector: 'vtm-applicant-details',
  templateUrl: './applicant-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicantDetailsComponent implements OnChanges {
  @Input() edit: boolean;
  @Input() adrDetails: AdrDetails;

  applicantDetails: ApplicantDetails;

  constructor() {}

  ngOnChanges(): void {
    this.applicantDetails = !!this.adrDetails.applicantDetails
      ? this.adrDetails.applicantDetails
      : ({} as ApplicantDetails);
  }
}
