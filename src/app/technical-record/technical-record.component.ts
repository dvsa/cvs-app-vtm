import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  OnDestroy
} from '@angular/core';
import { initAll } from 'govuk-frontend';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { selectSelectedVehicleTestResultModel } from '@app/store/selectors/VehicleTestResultModel.selectors';
import { IAppState } from '../adr-details-form/store/adrDetailsForm.state';
import { selectVehicleTechRecordModelHavingStatusAll } from '@app/store/selectors/VehicleTechRecordModel.selectors';
import { DownloadDocumentFileAction } from '@app/adr-details-form/store/adrDetails.actions';
import { AdrReasonModalComponent } from '@app/shared/adr-reason-modal/adr-reason-modal.component';
import { Router, NavigationEnd } from '@angular/router';
import { SubmitAdrAction } from './store/adrDetailsSubmit.actions';

@Component({
  selector: 'vtm-technical-record',
  templateUrl: './technical-record.component.html',
  styleUrls: ['./technical-record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicalRecordComponent implements OnInit , OnDestroy {
  submitData: string;
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
  navigationSubscription;

  constructor(private _store: Store<IAppState>, public dialog: MatDialog, private router: Router,) {
    this.initializeTechnicalRecord();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initializeTechnicalRecord();
      }
    });
  }

  initializeTechnicalRecord() {
    this.cancelAddrEdit();
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

  ngOnDestroy(): void {
    if (this.navigationSubscription) {  
      this.navigationSubscription.unsubscribe();
   }
  }


  public togglePanel() {
    for (const panel of this.panels) {
      panel.isOpened = !this.allOpened;
    }
    this.allOpened = !this.allOpened;
  }

  // public isNullOrEmpty(str) {
  //   return (typeof str === 'string' || str == null) ? !str || !str.trim() : false;
  // }

  public isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  public axlesHasNoParkingBrakeMrk(axles) {
    let baxlesHasNoParkingBrakeMrk = true;
    axles.forEach(axle => {
      if (axle.parkingBrakeMrk === true) {
        baxlesHasNoParkingBrakeMrk = false;
      }
    });
    return baxlesHasNoParkingBrakeMrk;
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
    this.isAdrNull = isAdrNull == null;
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

  onSaveChanges() {

    let reasonForChanges = '';
    const dialogRef = this.dialog.open(AdrReasonModalComponent, {
      width: '600px',
      data: {context: 'Enter reason for changing technical record', response: reasonForChanges }
    });

    dialogRef.afterClosed().subscribe(result => {
      reasonForChanges = result;
      console.log(`The dialog was closed with response ${reasonForChanges}`);
      this._store.dispatch(new SubmitAdrAction(reasonForChanges));
    });
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
