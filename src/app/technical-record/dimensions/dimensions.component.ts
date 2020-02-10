import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';

@Component({
  selector: 'vtm-dimensions',
  templateUrl: './dimensions.component.html',
  styleUrls: ['../../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionsComponent implements OnInit {

  @Input() activeRecord: any;

  constructor(public techRecHelpers: TechRecordHelpersService) { }

  ngOnInit() {
  }

}
