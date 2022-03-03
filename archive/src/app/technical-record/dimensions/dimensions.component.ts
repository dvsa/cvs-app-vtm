import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-dimensions',
  templateUrl: './dimensions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionsComponent implements OnInit {
  @Input() activeRecord: TechRecord;
  @Input() editState: boolean;

  constructor() {}

  ngOnInit() {}
}
