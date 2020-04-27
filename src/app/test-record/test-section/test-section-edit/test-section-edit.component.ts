import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestType } from '@app/models/test.type';
import { TestResultModel } from '@app/models/test-result.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxConfirmationComponent } from '@app/shared/dialog-box-confirmation/dialog-box-confirmation.component';
import { Router } from '@angular/router';
import {
  REASON_FOR_ABANDONING_HGV_TRL,
  REASON_FOR_ABANDONING_PSV,
  REASON_FOR_ABANDONING_TIR,
  RESULT
} from '@app/test-record/test-record.enums';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';
import { SelectOption } from '@app/models/select-option';
import { TestRecordMapper } from '@app/test-record/test-record.mapper';

@Component({
  selector: 'vtm-test-section-edit',
  templateUrl: './test-section-edit.component.html',
  styleUrls: ['./test-section-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class TestSectionEditComponent implements OnInit {
  @Input() testType: TestType;
  @Input() testRecord: TestResultModel;
  @Input() applicableTestTypeIds1: {};
  @Input() applicableTestTypeIds2: {};
  @Input() isSubmitted: boolean;
  resultOptions: string[] = Object.values(RESULT);
  testResultChildForm: FormGroupDirective;
  testTypeGroup: FormGroup;
  testResultSubscription: Subscription;
  isAbandoned: boolean;
  prohibitionOptionSelected: string;
  prohibitionOptions: SelectOption[];
  reasonsForAbandoning: string[];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    parentForm: FormGroupDirective,
    private testRecordMapper: TestRecordMapper
  ) {
    this.testResultChildForm = parentForm;
  }

  ngOnInit() {
    this.isAbandoned = this.testType.testResult === 'abandoned';
    this.reasonsForAbandoning = this.testRecordMapper.getReasonsForAbandoning(
      this.testRecord.vehicleType,
      this.testType.testTypeId
    );
    this.testTypeGroup = this.testResultChildForm.form.get('testType') as FormGroup;

    if (!!this.testTypeGroup) {

      this.testTypeGroup.addControl(
        'testResult',
        new FormControl(this.testType.testResult, Validators.required)
      );

      this.testTypeGroup.addControl(
        'reasonForAbandoning',
        new FormControl(this.testType.reasonForAbandoning, Validators.required)
      );

      this.testTypeGroup.addControl(
        'additionalCommentsForAbandon',
        new FormControl(this.testType.additionalCommentsForAbandon)
      );

      this.testTypeGroup.addControl(
        'certificateNumber',
        new FormControl(this.testType.certificateNumber, Validators.required)
      );

      this.testTypeGroup.addControl(
        'testExpiryDate',
        new FormControl(
          this.testType.testExpiryDate ? this.testType.testExpiryDate.split('T')[0] : '',
          Validators.required
        )
      );

      this.testTypeGroup.addControl(
        'testAnniversaryDate',
        new FormControl(
          this.testType.testAnniversaryDate
            ? this.testType.testAnniversaryDate.split('T')[0]
            : '',
          Validators.required
        )
      );

      this.testTypeGroup.addControl(
        'testEndTimestamp',
        new FormControl(
          this.testRecord.testEndTimestamp ? this.testRecord.testEndTimestamp.split('T')[0] : '',
          Validators.required
        )
      );

      this.testTypeGroup.addControl(
        'testTypeStartTimestamp',
        new FormControl('22:11', Validators.required)
      );

      this.testTypeGroup.addControl(
        'testTypeEndTimestamp',
        new FormControl('11:33', Validators.required)
      );

      this.testTypeGroup.addControl(
        'prohibitionIssued',
        new FormControl(this.testType.prohibitionIssued, Validators.required)
      );

      this.testResultSubscription = this.testTypeGroup
        .get('testResult')
        .valueChanges.subscribe((value) => {
          this.isAbandoned = value === 'abandoned';
        });
    }

    this.prohibitionOptionSelected = this.testType.prohibitionIssued ? 'Yes' : 'No';
    this.prohibitionOptions = new DisplayOptionsPipe().transform(
      ['Yes', 'No'],
      [this.prohibitionOptionSelected]
    );
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
