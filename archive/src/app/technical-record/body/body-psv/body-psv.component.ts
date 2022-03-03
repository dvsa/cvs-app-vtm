import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-body-psv',
  templateUrl: './body-psv.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyPsvComponent implements OnInit {
  @Input() activeRecord: TechRecord;

  constructor() {}

  ngOnInit() {}
}
