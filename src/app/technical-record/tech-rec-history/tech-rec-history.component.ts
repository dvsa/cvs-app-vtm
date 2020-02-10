import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';

@Component({
  selector: 'vtm-tech-rec-history',
  templateUrl: './tech-rec-history.component.html',
  styleUrls: ['../../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecHistoryComponent implements OnInit {

  @Input() techRecordsJson: any;

  constructor(public techRecHelpers: TechRecordHelpersService) { }

  ngOnInit() {
  }

}
