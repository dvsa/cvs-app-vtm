import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';
import { DDA } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-dda',
  templateUrl: './dda.component.html',
  styleUrls: ['../../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DdaComponent implements OnInit {

  @Input() ddaDetails: DDA;

  constructor(public techRecHelpers: TechRecordHelpersService) { }

  ngOnInit() {}
}
