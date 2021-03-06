import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { TestResultModel } from '@app/models/test-result.model';
import { Preparer } from '@app/models/preparer';
import { VIEW_STATE } from '@app/app.enums';
import { COUNTRY_OF_REGISTRATION } from '@app/app.enums';

@Component({
  selector: 'vtm-vehicle',
  templateUrl: './vehicle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleComponent implements OnChanges {
  @Input() testRecord: TestResultModel;
  @Input() preparers: Preparer[];
  @Input() editState: VIEW_STATE;
  countryOfRegistration: string;

  constructor() {}

  ngOnChanges() {
    this.countryOfRegistration = COUNTRY_OF_REGISTRATION[this.testRecord.countryOfRegistration];
  }
}
