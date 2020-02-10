import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';
import {DownloadDocumentFileAction} from '@app/technical-record/adr-details-form/store/adrDetails.actions';
import {select, Store} from '@ngrx/store';
import {IAppState} from '@app/technical-record/adr-details-form/store/adrDetailsForm.state';
import {Observable} from 'rxjs';

@Component({
  selector: 'vtm-adr-details-view',
  templateUrl: './adr-details-view.component.html',
  styleUrls: ['../../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdrDetailsViewComponent implements OnInit {

  @Input() activeRecord: any;
  @Input() techRecordsJson: any;
  @Input() showCheck: boolean;
  @Input() adrData: boolean;
  @Input() hideForm: boolean;
  @Input() isAdrNull: boolean;

  vehicletypes$: Observable<string[]>;
  permittedDangerousGoodsFe$: Observable<string[]>;
  guidanceNotesFe$: Observable<string[]>;

  constructor(private _store: Store<IAppState>, public techRecHelpers: TechRecordHelpersService) {
  }

  ngOnInit() {
    this.vehicletypes$ = this._store
      .pipe(select(s => s.vehicleTechRecordModel.vehicleTechRecordModel.metadata.adrDetails.vehicleDetails.typeFe));
    this.permittedDangerousGoodsFe$ = this._store
      .pipe(select(s => s.vehicleTechRecordModel.vehicleTechRecordModel.metadata.adrDetails.permittedDangerousGoodsFe));
    this.guidanceNotesFe$ = this._store
      .pipe(select( s => s.vehicleTechRecordModel.vehicleTechRecordModel.metadata.adrDetails.additionalNotes.guidanceNotesFe));
  }

   switchAdrDisplay($event): void {
    this.adrData = !($event.currentTarget.value === 'true');
    this.hideForm = $event.currentTarget.value === 'false';
  }

  downloadDocument(doc): void {
    this._store.dispatch(new DownloadDocumentFileAction(doc));
  }

  trackByFn(index, item): number {
    return item.id;
  }

}
