import { ChangeDetectionStrategy, Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { AdrReasonModalComponent } from '@app/shared/adr-reason-modal/adr-reason-modal.component';
import { ComponentCanDeactivate } from '@app/shared/pending-changes-guard/pending-changes.guard';
import { selectVehicleTechRecordModelHavingStatusAll } from '@app/store/selectors/VehicleTechRecordModel.selectors';
import { selectSelectedVehicleTestResultModel } from '@app/store/selectors/VehicleTestResultModel.selectors';
import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';
import { select, Store } from '@ngrx/store';
import { initAll } from 'govuk-frontend';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IAppState } from './adr-details/adr-details-form/store/adrDetailsForm.state';
import { SubmitAdrAction } from './store/adrDetailsSubmit.actions';

@Component({
  selector: 'vtm-technical-record',
  templateUrl: './technical-record.component.html',
  styleUrls: ['../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicalRecordComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.isFormDirty) {
      const destinationLink = window.location.href;
      setTimeout(() => {
        window.history.replaceState({}, '', destinationLink);
        window.history.pushState({}, '', this.router.url);
      });
      return false;
    } else { return true; }
  }

  @HostBinding('@.disabled')
  public animationsDisabled = true;

  ngDestroyed$ = new Subject();
  techRecordsJson$: Observable<any>;
  testResultJson$: Observable<any>;
  isFormDirty: boolean;

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
  navigationSubscription;

  constructor(private _store: Store<IAppState>, public dialog: MatDialog, private router: Router, public techRecHelpers: TechRecordHelpersService) {
    this.initializeTechnicalRecord();
    this.navigationSubscription = this.router.events
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.initializeTechnicalRecord();
        }
      });
  }

  initializeTechnicalRecord() {
    this.cancelAddrEdit();
    this.techRecordsJson$ = this._store.select(selectVehicleTechRecordModelHavingStatusAll);
    this.testResultJson$ = this._store.pipe(select(selectSelectedVehicleTestResultModel));
  }

  ngOnInit() {
    initAll();
    this._store.pipe(select(state => state.adrDetails.formState.isDirty))
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe(isFormDirty => {
        this.isFormDirty = isFormDirty;
      });
  }

  ngOnDestroy(): void {
    this.ngDestroyed$.next();
  }

  public togglePanel() {
    for (const panel of this.panels) {
      panel.isOpened = !this.allOpened;
    }
    this.allOpened = !this.allOpened;
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

  onSaveChanges() {
    let reasonForChanges = '';
    const dialogRef = this.dialog.open(AdrReasonModalComponent, {
      width: '600px',
      data: { context: 'Enter reason for changing technical record', response: reasonForChanges }
    });

    dialogRef.afterClosed().subscribe(result => {
      reasonForChanges = result;
      console.log(`The dialog was closed with response ${reasonForChanges}`);
      this._store.dispatch(new SubmitAdrAction(reasonForChanges));
    });
  }

}
