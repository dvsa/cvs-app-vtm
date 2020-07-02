import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { initAll } from 'govuk-frontend';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';
import { MatDialog } from '@angular/material/dialog';
import { TestRecordMapper, TestTypesApplicable } from '@app/test-record/test-record.mapper';
import { Preparer } from '@app/models/preparer';
import { DialogBoxComponent } from '@app/shared/dialog-box/dialog-box.component';
import { TestStation } from '@app/models/test-station';
import { PreventLeavePageModalComponent } from '@app/shared/prevent-page-leave-modal/prevent-leave-page-modal.component';
import { TestDeleteReasonModalComponent } from '../modal/components/test-delete-reason-modal/test-delete-reason-modal.component';

@Component({
  selector: 'vtm-test-record',
  templateUrl: './test-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent implements OnInit, OnChanges {
  @Input() editState: VIEW_STATE;
  @Input() preparers: Preparer[];
  @Input() testResultObj: TestRecordTestType;
  @Input() testStations: TestStation[];
  @Input() testTypesApplicable: TestTypesApplicable;
  @Input() reasonForArchive: string;
  @Output() submitTest = new EventEmitter<TestResultModel>();
  @Output() switchState = new EventEmitter<VIEW_STATE>();
  @Output() downloadCert = new EventEmitter<string>();
  @Output() openReasonModal = new EventEmitter();
  @Output() archiveTest = new EventEmitter<TestResultModel>();
  testResultParentForm: FormGroup;

  hasDefectsApplicable: boolean;
  hasEmissionApplicable: boolean;
  hasSeatBeltApplicable: boolean;

  constructor(
    private parent: FormGroupDirective,
    protected fb: FormBuilder,
    private dialog: MatDialog,
    private testRecordMapper: TestRecordMapper
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { reasonForArchive } = changes;

    if (typeof reasonForArchive.currentValue === 'string') {
      this.deleteTest(reasonForArchive.currentValue);
    }
  }

  ngOnInit(): void {
    this.hasDefectsApplicable = this.testTypesApplicable.defectsApplicable[
      this.testResultObj.testType.testTypeId
    ];
    this.hasSeatBeltApplicable = !(
      this.testTypesApplicable.seatBeltApplicable[this.testResultObj.testType.testTypeId] &&
      this.testResultObj.testRecord.vehicleType === 'psv'
    );
    this.hasEmissionApplicable = !(
      this.testTypesApplicable.emissionDetailsApplicable[
        this.testResultObj.testType.testTypeId
      ] &&
      (this.testResultObj.testRecord.vehicleType === 'psv' ||
        this.testResultObj.testRecord.vehicleType === 'hgv') &&
      this.testResultObj.testType.testResult === 'pass'
    );

    initAll();
    this.switchState.emit(VIEW_STATE.VIEW_ONLY);
    this.testResultParentForm = new FormGroup({ testType: new FormGroup({}) });
  }

  switchCurrentState(state: string) {
    if (state === 'edit') {
      this.switchState.emit(VIEW_STATE.EDIT);
    } else {
      const dialogRef = this.dialog.open(PreventLeavePageModalComponent, {
        width: '45vw'
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.switchState.emit(VIEW_STATE.VIEW_ONLY);
          this.testResultObj = JSON.parse(JSON.stringify(this.testResultObj));
          this.testResultParentForm = new FormGroup({ testType: new FormGroup({}) });
        } else {
          this.switchState.emit(VIEW_STATE.EDIT);
        }
      });
    }
  }

  onSaveTestResult(testResultParentForm) {
    const testResultUpdated: TestResultModel = this.testRecordMapper.mapFormValues(
      JSON.parse(JSON.stringify(this.testResultParentForm.getRawValue())),
      JSON.parse(JSON.stringify(this.testResultObj))
    );

    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '45vw',
      data: { context: 'Enter reason for changing test record', actionName: 'Save test record' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.isSave) {
        testResultUpdated.reasonForCreation = result.data;
        this.submitTest.emit(testResultUpdated);
      }
    });
  }

  downloadCertificate() {
    const fileName = `${this.testResultObj.testType.testNumber}_${this.testResultObj.testRecord.vin}.pdf`;
    this.downloadCert.emit(fileName);
  }

  openArchiveReasonModal(): void {
    this.openReasonModal.emit();
  }

  deleteTest(reason: string): void {
    const newTestType = this.buildTestObjectToBeArchived(reason);
    this.archiveTest.emit(newTestType);
  }

  buildTestObjectToBeArchived(reason: string): TestResultModel {
    const clonedTestResult = { ...this.testResultObj.testRecord, reasonForCreation: reason };

    clonedTestResult.testTypes = clonedTestResult.testTypes.map((testType) => {
      if (testType.testTypeId === this.testResultObj.testType.testTypeId) {
        return { ...testType, statusUpdatedFlag: true };
      }
      return testType;
    });

    return clonedTestResult;
  }
}
