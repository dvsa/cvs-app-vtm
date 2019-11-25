import { ChangeDetectionStrategy, Component, HostBinding, OnInit, ViewChild, ElementRef } from '@angular/core';
import { initAll } from 'govuk-frontend';
import { Store, select } from '@ngrx/store';
import { Observable, pipe, combineLatest } from 'rxjs';
import { selectSelectedVehicleTestResultModel } from '../../store/selectors/VehicleTestResultModel.selectors';
import { selectVehicleTechRecordModelHavingStatusAll } from '../../store/selectors/VehicleTechRecordModel.selectors';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { VEHICLE_TYPES } from "@app/app.enums";
import { TechRecordModel } from "@app/models/tech-record.model";
import { CustomValidators } from "@app/components/technical-record/custom-validators";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AdrReasonModalComponent } from "@app/components/adr-reason-modal/adr-reason-modal.component";
import { FormGroupState, AddArrayControlAction, RemoveArrayControlAction } from 'ngrx-forms';
import { adrDetailsFormModel } from '@app/models/adrDetailsForm.model';
import { IAppState } from '@app/store/state/adrDetailsForm.state';
import { CreateGroupElementAction, RemoveGroupElementAction, SetSubmittedValueAction } from '@app/store/actions/adrDetailsForm.actions';
import { take, map, tap, withLatestFrom, filter, switchMap } from 'rxjs/operators';

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
  isMandatory: boolean;
  numberFee: any;
  dangerousGoods: any;
  isAdrNull: any;
  fileList: FileList;
  public files: Set<File> = new Set();

  techRecords: TechRecordModel[];

  adrDetailsForm: FormGroup;
  vehicleTypes: typeof VEHICLE_TYPES = VEHICLE_TYPES;
  store: Observable<any>;
  isVehicleTankOrBatterytest$: Observable<any>;

  constructor(private _store: Store<IAppState>, public matDialog: MatDialog) {
    this.techRecordsJson$ = this._store.select(selectVehicleTechRecordModelHavingStatusAll);
    this.testResultJson$ = this._store.select(selectSelectedVehicleTestResultModel);
    this.formState$ = this._store.pipe(select(s => s.adrDetails.formState));
    this.submittedValue$ = this._store.pipe(select(s => s.adrDetails.submittedValue));
    this.isVehicleTankOrBattery$ = combineLatest(this.techRecordsJson$, this.formState$).pipe(
      map(([techRecords, formState]) => {
        if (this.isNullOrEmpty(formState.value.type)) {
          return false;
        }
        console.log(`formState.value.type is ${JSON.stringify(formState.value.type)}`);
        const selectedVehicleType = techRecords.metadata.adrDetails.vehicleDetails.typeFe[formState.value.type];
        console.log(`fselectedVehicleType is ${JSON.stringify(selectedVehicleType)}`);
        return selectedVehicleType.includes('battery') || selectedVehicleType.includes('tank');
      }));
  }

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
        'name': new FormControl(null, [Validators.required, Validators.maxLength(150)]),
        'street': new FormControl(null, [Validators.required, Validators.maxLength(150)]),
        'town': new FormControl(null, [Validators.required, Validators.maxLength(100)]),
        'city': new FormControl(null, [Validators.required, Validators.maxLength(100)]),
        'postcode': new FormControl(null, [Validators.required, Validators.maxLength(25)]),
      }),
      'type': new FormControl(null, Validators.required),
      'approvalDate': new FormGroup({
        'day': new FormControl(null, Validators.required),
        'month': new FormControl(null, Validators.required),
        'year': new FormControl(null, Validators.required),
      }, CustomValidators.dateValidator),
      'permittedDangerousGoods': new FormControl([''], Validators.required),
      'compatibilityGroupJ': new FormGroup({
        'compatibilityJ': new FormControl(null),
      }),
      'additionalNotes': new FormControl(['']),
      'adrTypeApprovalNo': new FormControl(null),
      'tankManufacturer': new FormControl(null, [Validators.maxLength(70), requiredIfValidator(() => !this.adrDetailsForm.get('type').errors ? this.adrDetailsForm.get('type').value.includes('battery')
        || this.adrDetailsForm.get('type').value.includes('tank') : false)]),
      'yearOfManufacture': new FormControl(null, [Validators.maxLength(4), requiredIfValidator(() => !this.adrDetailsForm.get('type').errors ? this.adrDetailsForm.get('type').value.includes('battery')
        || this.adrDetailsForm.get('type').value.includes('tank') : false)]),
      'tankManufacturerSerialNo': new FormControl(null, [Validators.maxLength(50), requiredIfValidator(() => !this.adrDetailsForm.get('type').errors ? this.adrDetailsForm.get('type').value.includes('battery')
        || this.adrDetailsForm.get('type').value.includes('tank') : false)]),
      'tankTypeAppNo': new FormControl(null, [Validators.maxLength(65), requiredIfValidator(() => !this.adrDetailsForm.get('type').errors ? this.adrDetailsForm.get('type').value.includes('battery')
        || this.adrDetailsForm.get('type').value.includes('tank') : false)]),
      'tankCode': new FormControl(null, [Validators.maxLength(30), requiredIfValidator(() => !this.adrDetailsForm.get('type').errors ? this.adrDetailsForm.get('type').value.includes('battery')
        || this.adrDetailsForm.get('type').value.includes('tank') : false)]),
      'substancesPermitted': new FormGroup({
        'underTankCode': new FormControl(null),
        'classUN': new FormControl(null)
      }, [requiredIfValidator(() => !this.adrDetailsForm.get('type').errors ? this.adrDetailsForm.get('type').value.includes('battery') || this.adrDetailsForm.get('type').value.includes('tank') : false)]),
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
      'batteryListNumber': new FormControl(null, [Validators.maxLength(8), requiredIfValidator(() => !this.adrDetailsForm.get('type').errors ? this.adrDetailsForm.get('type').value.includes('battery') : false)]),
      'brakeDeclarationIssuer': new FormControl(null),
      'brakeEndurance': new FormControl(null),
      'brakeDeclarationsSeen': new FormControl(null),
      'declarationsSeen': new FormControl(null),
      'weight': new FormControl(null, requiredIfValidator(() => !this.adrDetailsForm.get('type').errors ? this.adrDetailsForm.get('brakeEndurance').value == "true" : false)),
      'certificateReq': new FormGroup({
        'yesCert': new FormControl(null),
        'noCert': new FormControl(null)
      }),
      'adrMoreDetail': new FormControl(null),
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

  public hasNoPrimaryVrms(vrms) {
    let bhasNoPrimaryVrms: boolean = true;
    vrms.forEach(vrm => {
      if (vrm.isPrimary === true) {
        bhasNoPrimaryVrms = false;
        return false;
      }
    });
    if (bhasNoPrimaryVrms) return true;
  }

  public adrEdit($event, techRecordsJson, numberFee, dangerousGoods, isAdrNull) {
    console.log(`$event is ${$event}, numberFee is ${numberFee}, dangerousGoods is ${dangerousGoods}, isAdrNull is ${isAdrNull}`);
    this.changeLabel = "Save technical record";
    this.isSubmit = true;
    this.adrData = false;
    this.showCheck = true;
    this.numberFee = numberFee;
    this.dangerousGoods = dangerousGoods;
    this.isAdrNull = isAdrNull;
    this._store.dispatch(new CreateGroupElementAction('adrDetails', techRecordsJson));
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
    setTimeout(() => {
      this.numberFee.push(note);
      this.adrDetailsForm.controls['additionalNotes'].patchValue(
        [note]
      );
    }, 500);
  }

  addDangerousGood(good: string) {
    setTimeout(() => {
      this.dangerousGoods.push(good);
      this.adrDetailsForm.controls['additionalNotes'].patchValue(
        [good]
      );
    }, 500);
  }

  addSubsequentInspection() {
    this.subsequentInspection = true;
  }

  onVTypeChange() {
    console.log(`called onVTypeChange `);
    // this.isMandatory = this.vehicleType.includes('battery') || this.vehicleType.includes('tank');
  }

  onPermittedChange($event) {
    this.compatibilityJ = $event.currentTarget.value == "6: 'Explosives (type 2)'" || $event.currentTarget.value == "7: 'Explosives (type 3)'";
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

}
