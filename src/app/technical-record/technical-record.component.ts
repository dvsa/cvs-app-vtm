import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit
} from '@angular/core';
import { initAll } from 'govuk-frontend';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { selectSelectedVehicleTestResultModel } from '@app/store/selectors/VehicleTestResultModel.selectors';
import { IAppState } from '../adr-details-form/store/adrDetailsForm.state';
import { selectVehicleTechRecordModelHavingStatusAll } from '@app/store/selectors/VehicleTechRecordModel.selectors';
import {DownloadDocumentFileAction} from '@app/adr-details-form/store/adrDetails.actions';

@Component({
  selector: 'vtm-technical-record',
  templateUrl: './technical-record.component.html',
  styleUrls: ['./technical-record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicalRecordComponent implements OnInit {

  techRecordsJson$: Observable<any>;
  testResultJson$: Observable<any>;

  @HostBinding('@.disabled')
  public animationsDisabled = true;
  isLoading: boolean;
  searchIdentifier = '{none searched}';
  panels: { panel: string, isOpened: boolean }[] = [{ panel: 'panel1', isOpened: false }, { panel: 'panel2', isOpened: false },
    { panel: 'panel3', isOpened: false }, { panel: 'panel4', isOpened: false },
    { panel: 'panel5', isOpened: false }, { panel: 'panel6', isOpened: false }, { panel: 'panel7', isOpened: false },
    { panel: 'panel8', isOpened: false }, { panel: 'panel9', isOpened: false }, { panel: 'panel10', isOpened: false }];
  allOpened = false;
  color = 'red';
  changeLabel = 'Change technical record';
  isSubmit = false;
  adrData = true;
  hideForm = false;
  showCheck = false;
  numberFee: any;
  isAdrNull: any;
  vehicleTypes$: Observable<string[]>;
  permittedDangerousGoodsFe$: Observable<string[]>;
  guidanceNotesFe$: Observable<string[]>;

  constructor(private _store: Store<IAppState>, public matDialog: MatDialog) {
    this.techRecordsJson$ = this._store.select(selectVehicleTechRecordModelHavingStatusAll);
    this.vehicleTypes$ = this._store
      .pipe(select(s => s.vehicleTechRecordModel.vehicleTechRecordModel.metadata.adrDetails.vehicleDetails.typeFe));
    this.permittedDangerousGoodsFe$ = this._store
      .pipe(select(s => s.vehicleTechRecordModel.vehicleTechRecordModel.metadata.adrDetails.permittedDangerousGoodsFe));
    this.guidanceNotesFe$ = this._store
      .pipe(select( s => s.vehicleTechRecordModel.vehicleTechRecordModel.metadata.adrDetails.additionalNotes.guidanceNotesFe));
    this.testResultJson$ = this._store.select(selectSelectedVehicleTestResultModel);
  }

  ngOnInit() {
    initAll();
  }

  public togglePanel() {
    for (const panel of this.panels) {
      panel.isOpened = !this.allOpened;
    }
    this.allOpened = !this.allOpened;
  }

  public isNullOrEmpty(str) {
    return (typeof str === 'string' || str == null) ? !str || !str.trim() : false;
  }

  public isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  public axlesHasNoParkingBrakeMrk(axles) {
    let baxlesHasNoParkingBrakeMrk = true;
    axles.forEach(axle => {
      if (axle.parkingBrakeMrk === true) {
        baxlesHasNoParkingBrakeMrk = false;
        return false;
      }
    });
    if (baxlesHasNoParkingBrakeMrk) { return true; }
  }

  public hasSecondaryVrms(vrms) {
    return (vrms.length > 1) && (vrms.filter(vrm => vrm.isPrimary === false).length > 0);
  }

  public adrEdit(techRecordsJson, numberFee, dangerousGoods, isAdrNull) {
    this.changeLabel = 'Save technical record';
    this.isSubmit = true;
    this.adrData = false;
    this.showCheck = true;
    this.numberFee = numberFee;
    this.isAdrNull = isAdrNull === undefined || isAdrNull == null;
    this.hideForm = this.isAdrNull;
  }

  public cancelAddrEdit() {
    this.changeLabel = 'Change technical record';
    this.adrData = true;
    this.showCheck = false;
    this.isSubmit = false;
    this.hideForm = false;
  }

  public switchAdrDisplay($event) {
    this.adrData = !($event.currentTarget.value === 'true');
    this.hideForm = $event.currentTarget.value === 'false';
  }


  downloadDocument(doc) {
    this._store.dispatch(new DownloadDocumentFileAction(doc));
  }

  onModalShow() {
    // const errorDialog = new MatDialogConfig();
    // errorDialog.data = this.adrDetailsForm;
    // this.matDialog.open(AdrReasonModalComponent, errorDialog);

    // console.log(this.adrDetailsForm);
  }

  trackByIndex(index: number) {
    return index;
  }

  trackById(_: number, id: string) {
    return id;
  }

  trackByFn(index, item) {
    return item.id;
  }
}
