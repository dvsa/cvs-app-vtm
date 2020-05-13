import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Applicant } from '../../models/tech-record.model';

@Component({
  selector: 'vtm-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicantComponent implements OnInit {
  @Input() applicantDetails: Applicant;
  address1And2 = '';
  constructor() {
  }

  ngOnInit() {
    if (this.applicantDetails) {
      this.address1And2 = this.applicantDetails.address2 ? this.applicantDetails.address1.concat(' ', this.applicantDetails.address2) : this.applicantDetails.address1;
    }
  }

}
