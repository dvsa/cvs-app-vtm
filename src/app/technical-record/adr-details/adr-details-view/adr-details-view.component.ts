import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';
import {DownloadDocumentFileAction} from '@app/technical-record/adr-details/adr-details-form/store/adrDetails.actions';
import {Store} from '@ngrx/store';
import {IAppState} from '@app/technical-record/adr-details/adr-details-form/store/adrDetailsForm.state';

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

  constructor(private _store: Store<IAppState>, public techRecHelpers: TechRecordHelpersService) {}

  ngOnInit() {
  }

  downloadDocument(doc): void {
    this._store.dispatch(new DownloadDocumentFileAction(doc));
  }

  trackByFn(index, item): number {
    return item.id;
  }

}
