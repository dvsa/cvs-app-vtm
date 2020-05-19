import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-vehicle-summary-psv',
  templateUrl: './vehicle-summary-psv.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleSummaryPsvComponent implements OnInit {
  @Input() activeRecord: TechRecord;

  constructor() {}

  ngOnInit() { }
}
