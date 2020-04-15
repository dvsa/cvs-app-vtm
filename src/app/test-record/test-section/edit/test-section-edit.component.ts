import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
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
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';
import { SelectOption } from '@app/models/select-option';
import {TestRecordMapper, TestTypesApplicable} from '@app/test-record/test-record.mapper';
import { FORM_UTILS } from '@app/utils';

@Component({
  selector: 'vtm-test-section-edit',
  templateUrl: './test-section-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class TestSectionEditComponent implements OnInit {
  @Input() testType: TestType;
  @Input() testRecord: TestResultModel;
  @Input() testTypesApplicable: TestTypesApplicable;
  resultOptions: string[] = Object.values(RESULT);
  testResultChildForm: FormGroupDirective;
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
    parentForm: FormGroupDirective,
    private testRecordMapper: TestRecordMapper
  ) {
    this.testResultChildForm = parentForm;
  }

  get reasonForAbandoning() {
    return this.testTypeGroup.get('reasonForAbandoning') as FormArray;
  }

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

    this.testTypeGroup = this.testResultChildForm.form.get('testType') as FormGroup;
    if (!this.testTypeGroup) {
      this.testResultChildForm.form.addControl('testType', new FormGroup({}));
      this.testTypeGroup = this.testResultChildForm.form.get('testType') as FormGroup;
    }

    if (!!this.testTypeGroup) {
      FORM_UTILS.addControlsToFormGroup(this.testTypeGroup, [
        {
          name: 'testResult',
          fieldState: { value: this.testType.testResult, validators: [Validators.required] }
        },
        {
          name: 'additionalCommentsForAbandon',
          fieldState: { value: this.testType.additionalCommentsForAbandon }
        },
        {
          name: 'certificateNumber',
          fieldState: {
            value: this.testType.certificateNumber,
            validators: [Validators.required]
          }
        },
        {
          name: 'testExpiryDate',
          fieldState: { value: this.testType.testExpiryDate, validators: [Validators.required] }
        },
        {
          name: 'testAnniversaryDate',
          fieldState: {
            value: this.testType.testAnniversaryDate,
            validators: [Validators.required]
          }
        },
        {
          name: 'prohibitionIssued',
          fieldState: {
            value: this.testType.prohibitionIssued,
            validators: [Validators.required]
          }
        },
        {
          name: 'reasonForAbandoning',
          fieldState: {
            value: this.mapReasonsToFormGroup(this.reasonsForAbandoningOptions),
            validators: [Validators.required]
          }
        },
        {
          name: 'testTypeEndTimestampDate',
          fieldState: {
            value: this.testType.testTypeEndTimestamp,
            validators: [Validators.required]
          }
        },
        {
          name: 'testTypeEndTimestampTime',
          fieldState: {
            value: this.testType.testTypeEndTimestamp,
            validators: [Validators.required]
          }
        },
        {
          name: 'testTypeStartTimestamp',
          fieldState: {
            value: this.testType.testTypeStartTimestamp,
            validators: [Validators.required]
          }
        }
      ]);

      this.testResultSubscription = this.testTypeGroup
        .get('testResult')
        .valueChanges.subscribe((value) => {
          this.isAbandoned = value === 'abandoned';
        });
    }
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
