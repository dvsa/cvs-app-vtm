import { ChangeDetectionStrategy, Component, HostBinding, OnInit, ViewChild, ElementRef } from '@angular/core';
import { initAll } from 'govuk-frontend';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, of, forkJoin } from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';
import { VEHICLE_TYPES } from '@app/app.enums';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormGroupState, AddArrayControlAction, RemoveArrayControlAction } from 'ngrx-forms';
import { adrDetailsFormModel } from '@app/models/adrDetailsForm.model';
import { IAppState } from '@app/store/state/adrDetailsForm.state';
import {
  SetSubmittedValueAction,
  CreatePermittedDangerousGoodElementAction,
  CreateGuidanceNoteElementAction,
  CreateTc3TypeElementAction,
  CreateTc3PeriodicExpiryDateElementAction,
  CreateTc3PeriodicNumberElementAction,
} from '@app/store/actions/adrDetailsForm.actions';
import { take, map, catchError, filter, withLatestFrom } from 'rxjs/operators';
import { AdrReasonModalComponent } from '@app/shared/adr-reason-modal/adr-reason-modal.component';
import { selectVehicleTechRecordModelHavingStatusAll } from '@app/store/selectors/VehicleTechRecordModel.selectors';
import { selectSelectedVehicleTestResultModel } from '@app/store/selectors/VehicleTestResultModel.selectors';

export interface Tc3Controls {
  Type: any;
  PeriodicNumber: any;
  ExpiryDate: any;
}

@Component({
  selector: 'vtm-technical-record',
  templateUrl: './technical-record.component.html',
  styleUrls: ['./technical-record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicalRecordComponent implements OnInit {

  formState$: Observable<FormGroupState<adrDetailsFormModel>>;
  submittedValue$: Observable<adrDetailsFormModel | undefined>;
  isVehicleTankOrBattery$: Observable<boolean>;
  isPermittedExplosiveDangerousGoods$: Observable<boolean>;
  techRecordsJson$: Observable<any>;
  testResultJson$: Observable<any>;

  @ViewChild('fileInput') fileInputVariable: ElementRef;
  @HostBinding('@.disabled')
  public animationsDisabled = true;
  isLoading: boolean;
  searchIdentifier = '{none searched}';
  panels: { panel: string, isOpened: boolean }[] = [{ panel: 'panel1', isOpened: false }, { panel: 'panel2', isOpened: false }, { panel: 'panel3', isOpened: false }, { panel: 'panel4', isOpened: false },
  { panel: 'panel5', isOpened: false }, { panel: 'panel6', isOpened: false }, { panel: 'panel7', isOpened: false }, { panel: 'panel8', isOpened: false },
  { panel: 'panel9', isOpened: false }, { panel: 'panel10', isOpened: false }];
  allOpened = false;
  color = 'red';
  changeLabel = 'Change technical record';
  isSubmit = false;
  adrData = true;
  hideForm = false;
  showCheck = false;
  subsequentInspection = false;
  compatibilityJ = false;
  isStatement = false;
  isBatteryApplicable = false;
  isBrakeDeclarationsSeen = false;
  isBrakeEndurance = false;
  vehicleType: string;
  numberFee: any;
  dangerousGoods: any;
  isAdrNull: any;
  fileList: FileList;
  public files: Set<File> = new Set();
  adrDetailsForm: FormGroup;
  vehicleTypes: typeof VEHICLE_TYPES = VEHICLE_TYPES;
  public permittedDangerousGoodsOptions$: Observable<string[]>;
  additionalNotesOptions$: Observable<string[]>;
  adrDetails$: Observable<any>;
  productListUnNoOptions$: Observable<number[]>;
  tc3TypeOptions$: Observable<number[]>;
  tc3PeriodicNumberOptions$: Observable<number[]>;
  tc3PeriodicExpiryDateOptions$: Observable<{
    day: number;
    month: number;
    year: number;
  }[]>;
  tc3Inspections$: Observable<any[]>;

  constructor(private _store: Store<IAppState>, public matDialog: MatDialog) {
    this.techRecordsJson$ = this._store.select(selectVehicleTechRecordModelHavingStatusAll);
    this.testResultJson$ = this._store.select(selectSelectedVehicleTestResultModel);
    this.adrDetails$ = this._store.select(s => s.adrDetails);
    this.formState$ = this._store.pipe(select(s => s.adrDetails.formState));
    this.permittedDangerousGoodsOptions$ = this._store.pipe(select(s => s.adrDetails.permittedDangerousGoodsOptions));

    this.productListUnNoOptions$ = this._store.pipe(
      filter(s => s.adrDetails.productListUnNo !== undefined),
      select(s => s.adrDetails.productListUnNo.options));
    this.tc3TypeOptions$ = this._store.pipe(
      filter(s => s.adrDetails.tc3Type !== undefined),
      select(s => s.adrDetails.tc3Type.options));
    this.tc3PeriodicNumberOptions$ = this._store.pipe(
      filter(s => s.adrDetails.tc3PeriodicNumber !== undefined),
      select(s => s.adrDetails.tc3PeriodicNumber.options));
    this.tc3PeriodicExpiryDateOptions$ = this._store.pipe(
      filter(s => s.adrDetails.tc3PeriodicExpiryDate !== undefined),
      select(s => s.adrDetails.tc3PeriodicExpiryDate.options));

    this.tc3TypeOptions$.subscribe(t => console.log(`tc3TypeOptions$ => ${JSON.stringify(t)}`));
    this.tc3PeriodicNumberOptions$.subscribe(t => console.log(`tc3PeriodicNumberOptions$ => ${JSON.stringify(t)}`));
    this.tc3PeriodicExpiryDateOptions$.subscribe(t => console.log(`tc3PeriodicExpiryDateOptions$ => ${JSON.stringify(t)}`));
    this.submittedValue$ = this._store.pipe(select(s => s.adrDetails.submittedValue));
    this.isVehicleTankOrBattery$ = combineLatest(this.techRecordsJson$, this.formState$).pipe(
      map(([techRecords, formState]) => {
        if (this.isNullOrEmpty(formState.value.type)) {
          return false;
        }
        return formState.value.type.includes('battery') || formState.value.type.includes('tank');
      }),
      catchError(err => {
        return of(false);
      })
    );

    this.isPermittedExplosiveDangerousGoods$ = this.formState$.pipe(map(s =>
      s.value.permittedDangerousGoods['Explosives (type 2)'] || s.value.permittedDangerousGoods['Explosives (type 3)']),
      catchError(err => {
        return of(false);
      })
    );
    this.additionalNotesOptions$ = this._store.pipe(select(s => s.adrDetails.additionalNotesOptions));
    this.tc3Inspections$ = combineLatest(this.tc3TypeOptions$, this.tc3PeriodicNumberOptions$, this.tc3PeriodicExpiryDateOptions$).pipe(
      withLatestFrom(this.tc3PeriodicNumberOptions$, this.tc3PeriodicExpiryDateOptions$),
      filter(([type, periodicNumber, expiryDate]) => type !== undefined || periodicNumber !== undefined || expiryDate !== undefined),
      map(([type, periodicNumber, expiryDate]) => {
        return [{type,periodicNumber,expiryDate}];
      })
    );
  }

  ngOnInit() {
    initAll();
  }

  public submit() {
    this.formState$.pipe(
      take(1),
      map(fs => new SetSubmittedValueAction(fs.value)),
    ).subscribe(this._store);
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
    console.log(`numberFee is ${numberFee}, dangerousGoods is ${dangerousGoods}, isAdrNull is ${isAdrNull}`);
    this.changeLabel = 'Save technical record';
    this.isSubmit = true;
    this.adrData = false;
    this.showCheck = true;
    this.numberFee = numberFee;
    this.dangerousGoods = dangerousGoods;
    this.isAdrNull = isAdrNull == undefined || isAdrNull == null;
    console.log(this.isAdrNull);
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

  public fileChange($event) {
    this.fileList = $event.target.files;
    if (this.fileList.length > 0) {
      for (let index = 0; index < this.fileList.length; index++) {
        const file: File = this.fileList[index];
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        this.files.add(file);
        console.log(file.name);
      }
    }
  }

  public changeListener($event): void {
    this.readThis($event.target);
    this.fileInputVariable.nativeElement.value = '';
  }

  private readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = () => {
      // console.log(myReader.result);
    };
    myReader.readAsDataURL(file);

    this.fileList = inputValue.files;
    if (this.fileList.length > 0) {
      for (let index = 0; index < this.fileList.length; index++) {
        const file: File = this.fileList[index];
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        this.files.add(file);
      }
    }
  }

  addAddUNOption() {
    this.formState$.pipe(
      take(1),
      map(s => s.controls.productListUnNo.id),
      map(id => new AddArrayControlAction(id, null, null)),
    ).subscribe(this._store);
  }

  removeUnoOption(index: number) {
    this.formState$.pipe(
      take(1),
      map(s => s.controls.productListUnNo.id),
      map(id => new RemoveArrayControlAction(id, index)),
    ).subscribe(this._store);
  }

  addAGuidanceNote(note: string) {
    this._store.dispatch(new CreateGuidanceNoteElementAction(note, false));
  }

  addDangerousGood(good: string) {
    this._store.dispatch(new CreatePermittedDangerousGoodElementAction(good, false));
  }

  addSubsequentInspection() {
    this.formState$.pipe(
      take(1),
      map(s => s.controls.tc3Type.id),
      map(id => new CreateTc3TypeElementAction(id, '1')),
    ).subscribe(this._store);

    this.formState$.pipe(
      take(1),
      map(s => s.controls.tc3PeriodicNumber.id),
      map(id => new CreateTc3PeriodicNumberElementAction(id, '')),
    ).subscribe(this._store);

    this.formState$.pipe(
      take(1),
      map(s => s.controls.tc3PeriodicExpiryDate.id),
      map(id => new CreateTc3PeriodicExpiryDateElementAction(id, {
        day: 1,
        month: 1,
        year: 1930
      })),
    ).subscribe(this._store);
    // this.subsequentInspection = true;
  }

  selectReferenceNumberChange($event) {
    this.isStatement = $event.currentTarget.value == 'isStatement';
  }

  onBatteryApplicableChange($event) {
    this.isBatteryApplicable = $event.currentTarget.value == 'applicable';
  }

  onManufactureBreakChange($event) {
    this.isBrakeDeclarationsSeen = $event.currentTarget.checked == true;
  }

  onBrakeEnduranceChange($event) {
    this.isBrakeEndurance = $event.currentTarget.checked == true;
  }

  onModalShow() {

    const errorDialog = new MatDialogConfig();
    errorDialog.data = this.adrDetailsForm;
    this.matDialog.open(AdrReasonModalComponent, errorDialog);

    console.log(this.adrDetailsForm);
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
