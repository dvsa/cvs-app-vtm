import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { TechRecord } from '@app/models/tech-record.model';
import { IBody } from '@app/models/body-type';

@Component({
  selector: 'vtm-body',
  templateUrl: './body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyComponent implements OnInit {
  @Input() editState: boolean;
  @Input() activeRecord: TechRecord;

  body: IBody;

  constructor() {}

  ngOnInit() {
    const { make, model, functionCode, conversionRefNo, bodyType } = this.activeRecord;

    this.body = {
      make,
      model,
      functionCode,
      conversionRefNo,
      bodyType
    };
  }
}
