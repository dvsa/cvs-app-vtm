import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecord } from '../../models/tech-record.model';

@Component({
  selector: 'vtm-weights',
  templateUrl: './weights.component.html',
  styleUrls: ['../../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightsComponent implements OnInit {
  @Input() activeRecord: TechRecord;

  constructor() {}

  ngOnInit() {}
}
