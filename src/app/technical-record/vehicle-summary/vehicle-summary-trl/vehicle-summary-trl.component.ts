import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-vehicle-summary-trl',
  templateUrl: './vehicle-summary-trl.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleSummaryTrlComponent implements OnInit {
  @Input() activeRecord: TechRecord;

  constructor() {}

  ngOnInit() {}
}
