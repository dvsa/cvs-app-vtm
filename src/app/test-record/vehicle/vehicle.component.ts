import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestResultModel } from '@app/models/test-result.model';
import { COUNTRY_OF_REGISTRATION } from '@app/app.enums';

@Component({
  selector: 'vtm-vehicle',
  templateUrl: './vehicle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleComponent implements OnInit {
  @Input() testRecord: TestResultModel;
  countryOfRegistration: string;

  constructor() {}

  ngOnInit() {
    this.countryOfRegistration = COUNTRY_OF_REGISTRATION[this.testRecord.countryOfRegistration];
  }
}
