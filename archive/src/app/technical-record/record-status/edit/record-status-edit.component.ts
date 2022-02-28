import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroupDirective, ControlContainer, FormGroup, FormBuilder } from '@angular/forms';

import { TechRecord } from '@app/models/tech-record.model';
import { RECORD_STATUS } from '@app/app.enums';
import { TechRecordHelperService } from '@app/technical-record/tech-record-helper.service';

@Component({
  selector: 'vtm-record-status-edit',
  templateUrl: './record-status-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class RecordStatusEditComponent implements OnInit {
  @Input() techRecord: TechRecord;

  recordCompleteness: string;

  techRecordFg: FormGroup;
  recordOptions = {
    ['Current']: RECORD_STATUS.CURRENT,
    ['Provisional']: RECORD_STATUS.PROVISIONAL
  };

  constructor(
    private parent: FormGroupDirective,
    private fb: FormBuilder,
    private techRecHelper: TechRecordHelperService
  ) {}

  ngOnInit() {
    this.recordCompleteness = this.techRecHelper.getCompletenessInfoByKey(
      this.techRecord.recordCompleteness
    );

    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;
    this.techRecordFg.addControl('statusCode', this.fb.control(this.techRecord.statusCode));
  }
}
