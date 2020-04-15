import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-record-status',
  templateUrl: './record-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordStatusComponent implements OnInit {
  @Input() activeRecord: TechRecord;
  @Input() editState: boolean;

  constructor() {}

  ngOnInit() {}
}
