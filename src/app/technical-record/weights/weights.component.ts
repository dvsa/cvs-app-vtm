import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecord } from '../../models/tech-record.model';

@Component({
  selector: 'vtm-weights',
  templateUrl: './weights.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightsComponent implements OnInit {
  @Input() activeRecord: TechRecord;
  @Input() editState: boolean;

  constructor() {}

  ngOnInit() {}
}
