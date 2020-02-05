import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input} from '@angular/core';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';

@Component({
  selector: 'vtm-test-history',
  templateUrl: './test-history.component.html',
  styleUrls: ['./test-history.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestHistoryComponent implements OnInit {

  @Input() testResultJson: any;


  constructor(public techRecHelpers: TechRecordHelpersService) { }

  ngOnInit() {
  }

}
