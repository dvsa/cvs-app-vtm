import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormGroupDirective, FormBuilder } from '@angular/forms';

import { IBody, BodyType } from '@app/models/body-type';
import { SelectOption } from '@app/models/select-option';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';
import {
  BODY_TYPE_DESC,
  FUNCTION_OPTIONS
} from '@app/technical-record/technical-record.constants';

@Component({
  selector: 'vtm-body-edit',
  templateUrl: './body-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyEditComponent implements OnInit {
  @Input() bodyDetails: IBody;

  techRecordFg: FormGroup;
  bodyTypeDescOptions: SelectOption[];
  functionOptions = FUNCTION_OPTIONS;

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  ngOnInit() {
    this.bodyTypeDescOptions = new DisplayOptionsPipe().transform(BODY_TYPE_DESC);

    const bodyType = this.bodyDetails.bodyType ? this.bodyDetails.bodyType : ({} as BodyType);

    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;
    this.techRecordFg.addControl('make', this.fb.control(this.bodyDetails.make));
    this.techRecordFg.addControl('model', this.fb.control(this.bodyDetails.model));
    this.techRecordFg.addControl('functionCode', this.fb.control(this.bodyDetails.functionCode));
    this.techRecordFg.addControl(
      'conversionRefNo',
      this.fb.control(this.bodyDetails.conversionRefNo)
    );

    this.techRecordFg.addControl(
      'bodyType',
      this.fb.group({
        description: this.fb.control(bodyType.description)
      })
    );
  }
}
