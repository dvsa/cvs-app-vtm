import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TechnicalRecordFieldsComponent } from '../technical-record-fields.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'vtm-applicant-fields',
  templateUrl: './applicant-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicantFieldsComponent extends TechnicalRecordFieldsComponent implements OnInit {
  technicalRecord: FormGroup;

  ngOnInit() {
    this.technicalRecord = super.setUp();

    this.technicalRecord.addControl(
      'applicantDetails',
      this.fb.group({
        name: this.fb.control('name'),
        address1: this.fb.control('address1'),
        address2: this.fb.control('address2'),
        postTown: this.fb.control('postTown'),
        address3: this.fb.control('address3'),
        postCode: this.fb.control('postCode'),
        telephoneNumber: this.fb.control('telephoneNumber'),
        emailAddress: this.fb.control('emailAddress')
      })
    );
  }
}
