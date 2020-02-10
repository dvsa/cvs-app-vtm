import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';

@Component({
  selector: 'vtm-body',
  templateUrl: './body.component.html',
  styleUrls: ['../../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyComponent implements OnInit {

  @Input() activeRecord: any;

  constructor(public techRecHelpers: TechRecordHelpersService) { }

  ngOnInit() {
  }

}
