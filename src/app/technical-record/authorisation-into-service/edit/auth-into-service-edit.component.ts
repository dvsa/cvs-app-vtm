import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, ControlContainer, FormGroupDirective, FormBuilder } from '@angular/forms';

import { AuthIntoService } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-auth-into-service-edit',
  templateUrl: './auth-into-service-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class AuthIntoServiceEditComponent implements OnInit {
  @Input() authIntoServiceEditDetails: AuthIntoService;

  techRecordFg: FormGroup;

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  get authIntoService() {
    return this.techRecordFg.get('authIntoService') as FormGroup;
  }

  ngOnInit() {
    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;

    const authDetails: AuthIntoService = !!this.authIntoServiceEditDetails
      ? this.authIntoServiceEditDetails
      : ({} as AuthIntoService);

    this.techRecordFg.addControl(
      'authIntoService',
      this.fb.group({
        cocIssueDate: this.fb.control(authDetails.cocIssueDate),
        dateReceived: this.fb.control(authDetails.dateReceived),
        datePending: this.fb.control(authDetails.datePending),
        dateAuthorised: this.fb.control(authDetails.dateAuthorised),
        dateRejected: this.fb.control(authDetails.dateRejected)
      })
    );
  }
}
