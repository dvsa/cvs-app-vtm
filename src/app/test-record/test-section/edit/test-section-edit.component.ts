import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { TestType } from '@app/models/test.type';
import { TestResultModel } from '@app/models/test-result.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxConfirmationComponent } from '@app/shared/dialog-box-confirmation/dialog-box-confirmation.component';
import { Router } from '@angular/router';
import { RESULT } from '@app/test-record/test-record.enums';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';
import { SelectOption } from '@app/models/select-option';
import { TestRecordMapper, TestTypesApplicable } from '@app/test-record/test-record.mapper';

@Component({
  selector: 'vtm-test-section-edit',
  templateUrl: './test-section-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class TestSectionEditComponent implements OnChanges, OnInit {
  @Input() testType: TestType;
  @Input() testRecord: TestResultModel;
  @Input() testTypesApplicable: TestTypesApplicable;
  resultOptions: string[] = Object.values(RESULT);
  testTypeGroup: FormGroup;
  testResultSubscription: Subscription;
  isAbandoned: boolean;
  prohibitionOptionSelected: string;
  prohibitionOptions: SelectOption[];
  reasonsForAbandoning: string[];
  reasonsForAbandoningOptions;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private parentForm: FormGroupDirective,
    private testRecordMapper: TestRecordMapper,
    private fb: FormBuilder
  ) {}

  get reasonForAbandoning() {
    return this.testTypeGroup.get('reasonForAbandoning') as FormArray;
  }

  ngOnChanges() {}

  ngOnInit() {
    this.isAbandoned = this.testType.testResult === 'abandoned';
    this.prohibitionOptionSelected = this.testType.prohibitionIssued ? 'Yes' : 'No';
    this.reasonsForAbandoning = this.testRecordMapper.getReasonsForAbandoning(
      this.testRecord.vehicleType,
      this.testType.testTypeId
    );

    this.prohibitionOptions = new DisplayOptionsPipe().transform(
      ['Yes', 'No'],
      [this.prohibitionOptionSelected]
    );
    this.reasonsForAbandoningOptions = new DisplayOptionsPipe().transform(
      this.reasonsForAbandoning,
      [this.testType.reasonForAbandoning]
    );

    this.testTypeGroup = this.parentForm.form.get('testType') as FormGroup;
    this.testTypeGroup.addControl('testResult', this.fb.control(this.testType.testResult));
    this.testTypeGroup.addControl(
      'additionalCommentsForAbandon',
      this.fb.control(this.testType.additionalCommentsForAbandon)
    );
    this.testTypeGroup.addControl(
      'certificateNumber',
      this.fb.control(this.testType.certificateNumber)
    );
    this.testTypeGroup.addControl(
      'testExpiryDate',
      this.fb.control(this.testType.testExpiryDate)
    );
    this.testTypeGroup.addControl(
      'testAnniversaryDate',
      this.fb.control(this.testType.testAnniversaryDate)
    );
    this.testTypeGroup.addControl(
      'prohibitionIssued',
      this.fb.control(this.testType.prohibitionIssued)
    );
    this.testTypeGroup.addControl(
      'reasonForAbandoning',
      this.fb.control(this.mapReasonsToFormGroup(this.reasonsForAbandoningOptions))
    );

    this.testTypeGroup.addControl(
      'testTypeEndTimestampDate',
      this.fb.control(this.testType.testTypeEndTimestamp)
    );
    this.testTypeGroup.addControl(
      'testTypeEndTimestampTime',
      this.fb.control(this.testType.testTypeEndTimestamp)
    );
    this.testTypeGroup.addControl(
      'testTypeStartTimestamp',
      this.fb.control(this.testType.testTypeStartTimestamp)
    );
  }

  mapReasonsToFormGroup(options: SelectOption[]) {
    return options.map((option) => {
      return new FormControl(option.selected);
    });
  }

  onChangeTestType() {
    const dialogRef = this.dialog.open(DialogBoxConfirmationComponent, {
      width: '45vw',
      data: {
        context:
          '<h2 class="govuk-heading-l">Change test type</h2>' +
          '<p class="govuk-body">If you change the test type, some of the current test details will be lost.</br>' +
          'Print a version of the current test record or save the details to refer to when entering the details for the new test type.</p>',
        actionName: 'Change test type'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate(['/select-test-type', this.testType.testNumber]);
      }
    });
  }
}
