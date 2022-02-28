import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormBuilder } from '@angular/forms';

import { TechRecord } from '@app/models/tech-record.model';
import { SelectOption } from '@app/models/select-option';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';
import { APPROVAL_TYPE } from '@app/technical-record/technical-record.constants';

@Component({
  selector: 'vtm-type-approval',
  templateUrl: './type-approval.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class TypeApprovalComponent implements OnInit {
  @Input() techRecord: TechRecord;

  techRecordFg: FormGroup;
  approvalTypeOptions: SelectOption[];

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  ngOnInit() {
    this.approvalTypeOptions = new DisplayOptionsPipe().transform(APPROVAL_TYPE);

    this.techRecordFg = this.parent.form as FormGroup;
    this.techRecordFg.addControl('approvalType', this.fb.control(this.techRecord.approvalType));
    this.techRecordFg.addControl(
      'approvalTypeNumber',
      this.fb.control(this.techRecord.approvalTypeNumber)
    );
    this.techRecordFg.addControl('ntaNumber', this.fb.control(this.techRecord.ntaNumber));
    this.techRecordFg.addControl('variantNumber', this.fb.control(this.techRecord.variantNumber));
    this.techRecordFg.addControl(
      'variantVersionNumber',
      this.fb.control(this.techRecord.variantVersionNumber)
    );
  }
}
