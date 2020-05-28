import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecord } from '../../models/tech-record.model';

@Component({
  selector: 'vtm-body',
  templateUrl: './body.component.html',
  styleUrls: ['../../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyComponent implements OnInit {
  @Input() activeRecord: TechRecord;

  constructor() {}

  ngOnInit() {}
}
