import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-vehicle-summary-hgv',
  templateUrl: './vehicle-summary-hgv.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleSummaryHgvComponent implements OnInit {
  @Input() activeRecord: TechRecord;

  constructor() {}

  ngOnInit() {}
}
