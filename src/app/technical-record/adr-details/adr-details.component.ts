import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {IAppState} from '@app/technical-record/adr-details/adr-details-form/store/adrDetailsForm.state';

@Component({
  selector: 'vtm-adr-details',
  templateUrl: './adr-details.component.html',
  styleUrls: ['../../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdrDetailsComponent implements OnInit {

  @Input() activeRecord: any;
  @Input() showCheck: boolean;
  @Input() isAdrNull: boolean;
  @Input() adrData: boolean;
  @Input() hideForm: boolean;
  @Input() techRecordsJson: any;

  vehicletypes$: Observable<string[]>;
  permittedDangerousGoodsFe$: Observable<string[]>;
  guidanceNotesFe$: Observable<string[]>;

  constructor(private _store: Store<IAppState>) { }

  ngOnInit() {
    this.vehicletypes$ = this._store.pipe(select(s => s.vehicleTechRecordModel.vehicleTechRecordModel[0].metadata.adrDetails.vehicleDetails.typeFe));
    this.permittedDangerousGoodsFe$ = this._store.pipe(select(s => s.vehicleTechRecordModel.vehicleTechRecordModel[0].metadata.adrDetails.permittedDangerousGoodsFe));
    this.guidanceNotesFe$ = this._store.pipe(select( s => s.vehicleTechRecordModel.vehicleTechRecordModel[0].metadata.adrDetails.additionalNotes.guidanceNotesFe));
  }

  switchAdrDisplay($event): void {
    this.adrData = !($event.currentTarget.value === 'true');
    this.hideForm = $event.currentTarget.value === 'false';
  }

}
