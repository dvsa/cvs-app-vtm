import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';

@Component({
  selector: 'vtm-test-history',
  templateUrl: './test-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestHistoryComponent implements OnInit {

  @Input() testResultJson: any;


  constructor(public techRecHelpers: TechRecordHelpersService) {
  }

  ngOnInit() {
  }

  setResultColor(testResult: string) {
    switch (testResult) {
      case 'pass':
        return {color: '#00703C'};
      case 'prs':
        return {color: '#1D70B8'};
      case 'fail':
      case 'abandoned':
        return {color: '#D4351C'};
      default:
        return {color: ''};
    }
  }

}
