import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';
import {Store} from '@ngrx/store';

@Component({
  selector: 'vtm-adr-details-view',
  templateUrl: './adr-details-view.component.html',
  styleUrls: ['../../../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdrDetailsViewComponent implements OnInit {

  @Input() activeRecord: any;
  @Input() techRecordsJson: any;
  @Input() hideForm: boolean;

  constructor(public techRecHelpers: TechRecordHelpersService) {}

  ngOnInit() {
  }

}
