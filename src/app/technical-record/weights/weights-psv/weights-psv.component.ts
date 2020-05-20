import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-weights-psv',
  templateUrl: './weights-psv.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightsPsvComponent implements OnInit {
  @Input() activeRecord: TechRecord;
  
  constructor() { }

  ngOnInit() { }

}
