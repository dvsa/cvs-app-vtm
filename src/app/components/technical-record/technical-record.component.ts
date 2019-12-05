import { ChangeDetectionStrategy, Component, HostBinding, OnInit, ViewChild, ElementRef } from '@angular/core';
import { initAll } from 'govuk-frontend';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { selectSelectedVehicleTestResultModel } from '../../store/selectors/VehicleTestResultModel.selectors';
import { selectVehicleTechRecordModelHavingStatusAll } from '../../store/selectors/VehicleTechRecordModel.selectors';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { VEHICLE_TYPES } from "@app/app.enums";
import { CustomValidators } from "@app/components/technical-record/custom-validators";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FormGroupState } from 'ngrx-forms';
import { adrDetailsFormModel } from '@app/models/adrDetailsForm.model';
import { IAppState } from '@app/store/state/adrDetailsForm.state';
import { SetSubmittedValueAction, CreatePermittedDangerousGoodElementAction, CreateGuidanceNoteElementAction } from '@app/store/actions/adrDetailsForm.actions';
import { take, map, catchError } from 'rxjs/operators';
import { a } from '@angular/core/src/render3';
import { AdrReasonModalComponent } from '@app/shared/adr-reason-modal/adr-reason-modal.component';

@Component({
  selector: 'app-technical-record',
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
  changeLabel: string = "Change technical record";
  isSubmit: boolean = false;
  adrData: boolean = true;
  hideForm: boolean = false;
  showCheck: boolean = false;
  subsequentInspection: boolean = false;
  compatibilityJ: boolean = false;
  isStatement: boolean = false;
  isBatteryApplicable: boolean = false;
  isBrakeDeclarationsSeen: boolean = false;
  isBrakeEndurance: boolean = false;
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

  constructor(private _store: Store<IAppState>, public matDialog: MatDialog) {
    this.techRecordsJson$ = this._store.select(selectVehicleTechRecordModelHavingStatusAll);
    this.testResultJson$ = this._store.select(selectSelectedVehicleTestResultModel);
    this.adrDetails$ = this._store.select(s => s.adrDetails);
    this.formState$ = this._store.pipe(select(s => s.adrDetails.formState));
    this.permittedDangerousGoodsOptions$ = this._store.pipe(select(s => s.adrDetails.permittedDangerousGoodsOptions));
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
  }

  public keepOriginalOrder = (a, b) => a.key;

  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //     // TODO: send the error to remote logging infrastructure
  //     console.error(error); // log to console instead

  //     // TODO: better job of transforming error for user consumption
  //     this.log(`${operation} failed: ${error.message}`);

  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // }

  // private log(message: string) {
  //   console.log(`TestResultService: ${message}`);
  // }


  ngOnInit() {
    initAll();
    //this.adrDetailsForm = AdrDetailsFormData.AdrDetailsForm;

    function requiredIfValidator(predicate) {
      return (formControl => {
        if (!formControl.parent) {
          return null;
        }
        if (predicate()) {
          return Validators.required(formControl);
        }
        return null;
      })
    }

    this.adrDetailsForm = new FormGroup({
      'applicantDetails': new FormGroup({
        'name': new FormControl(null),
        'street': new FormControl(null),
        'town': new FormControl(null),
        'city': new FormControl(null),
        'postcode': new FormControl(null),
      }),
      'type': new FormControl(null, Validators.required),
      'approvalDate': new FormGroup({
        'day': new FormControl(null, Validators.required),
        'month': new FormControl(null, Validators.required),
        'year': new FormControl(null, Validators.required),
      }, CustomValidators.dateValidator),
      'permittedDangerousGoods': new FormControl({
        'permitted-0': new FormControl(null, Validators.required),
        'permitted-1': new FormControl(null, Validators.required),
        'permitted-2': new FormControl(null, Validators.required),
        'permitted-3': new FormControl(null, Validators.required),
        'permitted-4': new FormControl(null, Validators.required),
        'permitted-5': new FormControl(null, Validators.required),
        'permitted-6': new FormControl(null, Validators.required),
        'permitted-7': new FormControl(null, Validators.required)
      }),
      'compatibilityGroupJ': new FormGroup({
        'compatibilityJ': new FormControl(null),
      }),
      'additionalNotes': new FormControl({
        'note-0': new FormControl(null, Validators.required),
        'note-1': new FormControl(null, Validators.required),
        'note-2': new FormControl(null, Validators.required),
        'note-3': new FormControl(null, Validators.required),
        'note-4': new FormControl(null, Validators.required),
        'note-5': new FormControl(null, Validators.required),
        'note-6': new FormControl(null, Validators.required)
      }),
      'adrTypeApprovalNo': new FormControl(null),
      'tankManufacturer': new FormControl(null, [Validators.maxLength(70)]),
      'yearOfManufacture': new FormControl(null, [Validators.maxLength(4)]),
      'tankManufacturerSerialNo': new FormControl(null, [Validators.maxLength(50)]),
      'tankTypeAppNo': new FormControl(null, [Validators.maxLength(65)]),
      'tankCode': new FormControl(null, [Validators.maxLength(30)]),
      'substancesPermitted': new FormGroup({
        'underTankCode': new FormControl(null),
        'classUN': new FormControl(null)
      }),
      'selectReferenceNumber': new FormGroup({
        'isStatement': new FormControl(null),
        'isProductListRefNo': new FormControl(null)
      }),
      'statement': new FormControl(null, [Validators.maxLength(1500)]),
      'productListRefNo': new FormControl(null),
      'productListUnNo': new FormArray([]),
      'productList': new FormControl(null, [Validators.maxLength(1500)]),
      'specialProvisions': new FormControl(null, [Validators.maxLength(1024)]),
      'tc2Type': new FormControl(null),
      'tc2IntermediateApprovalNo': new FormControl(null, [Validators.maxLength(75)]),
      'tc2IntermediateExpiryDate': new FormGroup({
        'dayExpiry': new FormControl(null),
        'monthExpiry': new FormControl(null),
        'yearExpiry': new FormControl(null),
      }, CustomValidators.dateValidator),
      'tc3Type': new FormControl(null),
      'tc3PeriodicNumber': new FormControl(null, [Validators.maxLength(75)]),
      'tc3PeriodicExpiryDate': new FormGroup({
        'dayExpiryTc3': new FormControl(null),
        'monthExpiryTc3': new FormControl(null),
        'yearExpiryTc3': new FormControl(null),
      }, CustomValidators.dateValidator),
      'memosApply': new FormGroup({
        'isMemo': new FormControl(null, Validators.required),
        'isNotMemo': new FormControl(null, Validators.required)
      }),
      'listStatementApplicable': new FormGroup({
        'applicable': new FormControl(null),
        'notApplicable': new FormControl(null)
      }),
      'batteryListNumber': new FormControl(null, [Validators.maxLength(8)]),
      'brakeDeclarationIssuer': new FormControl(null),
      'brakeEndurance': new FormControl(null),
      'brakeDeclarationsSeen': new FormControl(null),
      'declarationsSeen': new FormControl(null),
      'weight': new FormControl(null),
      'certificateReq': new FormGroup({
        'yesCert': new FormControl(null),
        'noCert': new FormControl(null)
      }),
      'adrMoreDetail': new FormControl(null),
    });

    this.setVTypeValidators();

  }

  setVTypeValidators() {
    const vehicleType = this.adrDetailsForm.get('type');
    const tankManufacturer = this.adrDetailsForm.get('tankManufacturer');
    const yearOfManufacture = this.adrDetailsForm.get('yearOfManufacture');
    const tankManufacturerSerialNo = this.adrDetailsForm.get('tankManufacturerSerialNo');
    const tankTypeAppNo = this.adrDetailsForm.get('tankTypeAppNo');
    const tankCode = this.adrDetailsForm.get('tankCode');
    const weight = this.adrDetailsForm.get('weight');
    const batteryListNumber = this.adrDetailsForm.get('batteryListNumber');
    const permittedDangerousGoods = this.adrDetailsForm.get('permittedDangerousGoods');

    vehicleType.valueChanges
      .subscribe(vType => {
        if (vehicleType.value != undefined) {
          if (vehicleType.value.includes('battery') || vehicleType.value.includes('tank') ) {
            tankManufacturer.setValidators([Validators.required]);
            yearOfManufacture.setValidators([Validators.required]);
            tankManufacturerSerialNo.setValidators([Validators.required]);
            tankTypeAppNo.setValidators([Validators.required]);
            tankCode.setValidators([Validators.required]);
            weight.setValidators([Validators.required]);
            batteryListNumber.setValidators([Validators.required]);
            permittedDangerousGoods.setValidators([Validators.required]);
          }
        }
        tankManufacturer.updateValueAndValidity();
        yearOfManufacture.updateValueAndValidity();
        tankManufacturerSerialNo.updateValueAndValidity();
        tankTypeAppNo.updateValueAndValidity();
        tankCode.updateValueAndValidity();
        weight.updateValueAndValidity();
        batteryListNumber.updateValueAndValidity();
        permittedDangerousGoods.updateValueAndValidity();
      });
  }

  public submit() {
    this.formState$.pipe(
      take(1),
      map(fs => new SetSubmittedValueAction(fs.value)),
    ).subscribe(this._store);
  }

  public togglePanel() {
    for (let panel of this.panels) {
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
    let baxlesHasNoParkingBrakeMrk: boolean = true;
    axles.forEach(axle => {
      if (axle.parkingBrakeMrk === true) {
        baxlesHasNoParkingBrakeMrk = false;
        return false;
      }
    });
    if (baxlesHasNoParkingBrakeMrk) return true;
  }

  public hasSecondaryVrms(vrms) {
    return (vrms.length > 1) && (vrms.filter( vrm => vrm.isPrimary === false).length > 0);
  }

  public adrEdit(techRecordsJson, numberFee, dangerousGoods, isAdrNull) {
    console.log(`numberFee is ${numberFee}, dangerousGoods is ${dangerousGoods}, isAdrNull is ${isAdrNull}`);
    this.changeLabel = "Save technical record";
    this.isSubmit = true;
    this.adrData = false;
    this.showCheck = true;
    this.numberFee = numberFee;
    this.dangerousGoods = dangerousGoods;
    this.isAdrNull = isAdrNull;
    // this._store.dispatch(new CreateGroupElementAction('adrDetails', techRecordsJson));
  }

  public cancelAddrEdit() {
    this.changeLabel = "Change technical record";
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
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        this.files.add(file);
        console.log(file.name);
      }
    }
  }

  public changeListener($event): void {
    this.readThis($event.target);
    this.fileInputVariable.nativeElement.value = "";
  }

  private readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = () => {
      // console.log(myReader.result);
    }
    myReader.readAsDataURL(file);

    this.fileList = inputValue.files;
    if (this.fileList.length > 0) {
      for (let index = 0; index < this.fileList.length; index++) {
        const file: File = this.fileList[index];
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        this.files.add(file);
      }
    }
  }

  onAddUN() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.adrDetailsForm.get('productListUnNo')).push(control);
  }

  addAGuidanceNote(note: string) {
    this._store.dispatch(new CreateGuidanceNoteElementAction(note, false));
  }

  addDangerousGood(good: string) {
    this._store.dispatch(new CreatePermittedDangerousGoodElementAction(good, false));
  }

  addSubsequentInspection() {
    this.subsequentInspection = true;
  }


  selectReferenceNumberChange($event) {
    this.isStatement = $event.currentTarget.value == "isStatement";
  }

  onBatteryApplicableChange($event) {
    this.isBatteryApplicable = $event.currentTarget.value == "applicable";
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
  //
  // isControlValid( controlGroupName : string, controlName: string ){
  //
  //   let adrDetailsForm = this.adrDetailsForm;
  //
  //   if (controlGroupName == ''){
  //     return adrDetailsForm.controls[controlName].errors !=null ? adrDetailsForm.controls[controlName].errors.required && adrDetailsForm.controls[controlName].touched : false;
  //   } else {
  //     return adrDetailsForm.controls[controlGroupName].get(controlName).errors !=null ? adrDetailsForm.controls[controlGroupName].get(controlName).errors.required && adrDetailsForm.controls[controlGroupName].get(controlName).touched : false;
  //   }
  // }

}
