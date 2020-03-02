import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
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

@Component({
  selector: 'vtm-test-record',
  templateUrl: './test-record.component.html',
  styleUrls: ['./test-record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent implements OnInit {
  @Input() editState: VIEW_STATE;
  @Input() preparers: Preparer[];
  @Input() testResultObj: TestRecordTestType;
  @Input() testStations: TestStation[];
  @Input() testTypesApplicable: TestTypesApplicable;

  @Output() submitTest = new EventEmitter<TestResultModel>();
  @Output() switchState = new EventEmitter<VIEW_STATE>();
  @Output() isFormDirty = new EventEmitter<boolean>();
  @Output() hasErrors = new EventEmitter<string[]>();

  testResultParentForm: FormGroup;
  formErrors: string[];

  constructor(
    private dialog: MatDialog,
    private testRecordMapper: TestRecordMapper
  ) {}

  ngOnInit(): void {
    initAll();
    this.switchState.emit(VIEW_STATE.VIEW_ONLY);
    this.testResultParentForm = new FormGroup({ testType: new FormGroup({}) });
    this.onFormChanges();
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
        } else {
          this.switchState.emit(VIEW_STATE.EDIT);
        }
      });
    }
  }

  onSaveTestResult(form) {
    if (this.testResultParentForm.valid) {
      const testResultUpdated: TestResultModel = this.testRecordMapper.mapFormValues(
        this.testResultParentForm.getRawValue(),
        this.testResultObj
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
    } else {
      this.formErrors = this.getInvalidControls(this.testResultParentForm).map(
        (res) => 'Enter the ' + this.splitStringByUppercase(res)
      );
      this.hasErrors.emit(this.formErrors);
    }
  }

  onFormChanges(): void {
    this.testResultParentForm.valueChanges.subscribe((val) => {
      this.isFormDirty.emit(true);
    });
  }

  getInvalidControls(form: FormGroup): string[] {
    const invalidControls: string[] = [];
    const checkInvalid = (formtoCheck: FormGroup) => {
      Object.keys(formtoCheck.controls).forEach((field) => {
        const control = formtoCheck.get(field);
        if (control.invalid) {
          invalidControls.push(field);
        }
      });
    };
    checkInvalid(form);
    return invalidControls;
  }

  splitStringByUppercase(value: string): string {
    value = value.match(/[A-Z]*[^A-Z]+/g).join(' ');
    return value.toLowerCase();
  }
}
