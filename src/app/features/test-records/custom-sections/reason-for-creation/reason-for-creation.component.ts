import {
  BaseTestRecordV2Component
} from '@features/test-records/components/base-test-record-v2/base-test-record-v2.component';
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Modes } from '@models/modes.enum';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { select, Store } from '@ngrx/store';
import { selectedTestResultState } from '@store/test-records';
import { TestRecordsService } from '@services/test-records/test-records.service';
import {
  GovukFormGroupTextareaComponent
} from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';

@Component({
  selector: 'app-reason-for-creation',
  templateUrl: './reason-for-creation.component.html',
  imports: [
    GovukFormGroupTextareaComponent,
  ],
  styleUrls: ['./reason-for-creation.component.scss'],
})
export class ReasonForCreationComponent extends BaseTestRecordV2Component implements OnInit, OnDestroy  {

  destroy$ = new ReplaySubject<boolean>(1);
  mode = input.required<Modes>();
  store = inject(Store);
  testRecordService = inject(TestRecordsService);
  commonValidators = inject(CommonValidatorsService);

  testResult$ = this.testRecordService.editingTestResult$;

  form = this.fb.group({
    reasonForCreation: this.fb.control('', [
      this.commonValidators.required('Reason for creation', 'reason-for-creation', 'reasonForCreation'),
      this.commonValidators.maxLength(100, 'Reason for creation', 'reason-for-creation'),
    ]),
  });

  ngOnInit(): void {
    this.init(this.form);

    // Prepopulate form with current test record
    this.form.patchValue(this.testResult$ as any);
  }

  ngOnDestroy () {
    // Detach all form controls from parent
    this.destroy(this.form);

    // Clear subscriptions
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
