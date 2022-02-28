import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { Applicant, TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-applicant',
  templateUrl: './applicant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicantComponent implements OnChanges {
  @Input() techRecord: TechRecord;
  @Input() editState: boolean;

  address1And2: string;
  applicantDetails: Applicant;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const { techRecord } = changes;

    if (techRecord) {
      this.applicantDetails = !!this.techRecord.applicantDetails
        ? this.techRecord.applicantDetails
        : ({} as Applicant);

      this.address1And2 = Object.keys(this.applicantDetails).length
        ? `${this.applicantDetails.address1} ${this.applicantDetails.address2}`
        : '';
    }
  }
}
