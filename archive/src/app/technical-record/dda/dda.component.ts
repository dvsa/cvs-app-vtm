import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { DDA } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-dda',
  templateUrl: './dda.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DdaComponent implements OnInit {
  @Input() ddaDetails: DDA;

  constructor() {}

  ngOnInit() {}
}
