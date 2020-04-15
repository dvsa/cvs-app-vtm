import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecord } from '../../models/tech-record.model';

@Component({
  selector: 'vtm-tyres',
  templateUrl: './tyres.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TyresComponent implements OnInit {
  @Input() activeRecord: TechRecord;
  @Input() editState: boolean;

  constructor() {}

  ngOnInit() {}
}
