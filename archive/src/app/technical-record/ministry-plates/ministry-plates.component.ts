import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { UserService } from '@app/app-user.service';
import { Applicant, Plate } from '@app/models/tech-record.model';
import { PLATE_ISSUE_OPTIONS } from '@app/technical-record/technical-record.constants';

@Component({
  selector: 'vtm-ministry-plates',
  templateUrl: './ministry-plates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'plateComponent'
})
export class MinistryPlatesComponent implements OnInit {
  @Input() applicantDetails: Applicant;
  @Output() plateHandler = new EventEmitter<Plate>();
  platesForm: FormGroup;
  plateIssueOptions = PLATE_ISSUE_OPTIONS;

  constructor(public loggedUser: UserService) {}

  ngOnInit() {
    this.applicantDetails = !!this.applicantDetails ? this.applicantDetails : ({} as Applicant);

    this.platesForm = new FormGroup({});
    this.platesForm.addControl('plateIssuer', new FormControl(this.loggedUser.getUser().msUser));
    this.platesForm.addControl(
      'plateIssueDate',
      new FormControl(new Date(Date.now()).toISOString().split('T')[0])
    );
    this.platesForm.addControl('plateReasonForIssue', new FormControl('Original'));
    this.platesForm.addControl(
      'toEmailAddress',
      new FormControl(this.applicantDetails.emailAddress)
    );
  }
}
