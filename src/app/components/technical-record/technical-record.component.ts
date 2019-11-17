import {Component, HostBinding, OnInit} from '@angular/core';
import {initAll} from 'govuk-frontend';
import {select, Store} from '@ngrx/store';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {selectSelectedVehicleTestResultModel} from '../../store/selectors/VehicleTestResultModel.selectors';
import {GetVehicleTestResultModel} from '../../store/actions/VehicleTestResultModel.actions';
import {IAppState} from '../../store/state/app.state';
import {selectVehicleTechRecordModelHavingStatusAll} from '../../store/selectors/VehicleTechRecordModel.selectors';
import {GetVehicleTechRecordModelHavingStatusAll} from '../../store/actions/VehicleTechRecordModel.actions';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {VEHICLE_TYPES} from "@app/app.enums";
import {TechRecordModel} from "@app/models/tech-record.model";
import {CustomValidators} from "@app/components/technical-record/custom-validators";

@Component({
  selector: 'app-technical-record',
  templateUrl: './technical-record.component.html',
  styleUrls: ['./technical-record.component.scss'],
})
export class TechnicalRecordComponent implements OnInit {
  @HostBinding('@.disabled')
  public animationsDisabled = true;
  isLoading: boolean;
  searchIdentifier = '{none searched}';
  techRecordsJson$: Observable<any>;
  testResultJson$: Observable<any>;
  techRecordDropDowns$: Observable<any>;
  panels: {panel: string, isOpened: boolean}[] = [{panel: 'panel1', isOpened: false}, {panel: 'panel2', isOpened: false},{panel: 'panel3', isOpened: false},{panel: 'panel4', isOpened: false},
                                                  {panel: 'panel5', isOpened: false},{panel: 'panel6', isOpened: false},{panel: 'panel7', isOpened: false},{panel: 'panel8', isOpened: false},
                                                  {panel:'panel9',isOpened:false}];
  allOpened = false;
  color = 'red';
  changeLabel: string = "Change technical record";
  isSubmit: boolean   = false;
  adrData: boolean    = true;
  showCheck: boolean  = false;
  checkValue: string;
  subsequentInspection: boolean = false;
  techRecords: TechRecordModel[];
  techRecordsSubscription: Subscription;

  adrDetailsForm: FormGroup;
  vehicleTypes: typeof VEHICLE_TYPES = VEHICLE_TYPES;

  constructor(private _store: Store<IAppState>) {
    this.techRecordsJson$ = this._store.select(selectVehicleTechRecordModelHavingStatusAll);
    this.testResultJson$ = this._store.select(selectSelectedVehicleTestResultModel);
  }

  ngOnInit() {
    initAll();

    this.techRecordsSubscription = this.testResultJson$.subscribe(
      (techRecordState) => {
        console.log(techRecordState);
        this.techRecords = techRecordState!=null ? techRecordState.techRecord : [];
      }
    );

    this.adrDetailsForm = new FormGroup({
      'applicantDetails': new FormGroup({
        'name': new FormControl(null, [ Validators.required, Validators.maxLength(150) ]),
        'street': new FormControl(null, [ Validators.required, Validators.maxLength(150) ]),
        'town': new FormControl(null, [ Validators.required, Validators.maxLength(100) ]),
        'city': new FormControl(null, [ Validators.required, Validators.maxLength(100) ]),
        'postcode': new FormControl(null, [ Validators.required, Validators.maxLength(25) ]),
      }),
      'type': new FormControl(null, Validators.required),
      'approvalDate': new FormGroup({
        'day': new FormControl(null, Validators.required),
        'month': new FormControl(null, Validators.required),
        'year': new FormControl(null, Validators.required),
      }, CustomValidators.dateValidator),
      'permittedDangerousGoods': new FormControl ([''], Validators.required),
      'compatibilityGroupJ': new FormGroup({
        'yes': new FormControl (null, Validators.required),
        'no': new FormControl (null, Validators.required)
      }),
      'additionalNotes': new FormControl ([''], Validators.required),
      'adrTypeApprovalNo': new FormControl (null, Validators.required),
      'tankManufacturer': new FormControl(null, [ Validators.required, Validators.maxLength(70) ]),
      'yearOfManufacture': new FormControl(null, [ Validators.required, Validators.maxLength(4) ]),
      'tankManufacturerSerialNo': new FormControl(null, [ Validators.required, Validators.maxLength(50) ]),
      'tankTypeAppNo': new FormControl(null, [ Validators.required, Validators.maxLength(65) ]),
      'tankCode': new FormControl(null, [ Validators.required, Validators.maxLength(30) ]),
      'substancesPermitted': new FormGroup({
        'underTankCode': new FormControl (null, Validators.required),
        'classUN': new FormControl (null, Validators.required)
      }),
      'selectReferenceNumber': new FormGroup({
        'isStatement': new FormControl (null, Validators.required),
        'isProductListRefNo': new FormControl (null, Validators.required)
      }),
      'statement': new FormControl (null, [ Validators.required, Validators.maxLength(1500) ]),
      'productListRefNo': new FormControl (null, Validators.required),

      'productListUnNo': new FormArray([]),

      'productList': new FormControl (null, [ Validators.required, Validators.maxLength(1500) ]),
      'specialProvisions': new FormControl (null, [ Validators.required, Validators.maxLength(1024) ]),
      'tc3PeriodicNumber': new FormControl (null, [ Validators.required, Validators.maxLength(75) ]),
      'tc3PeriodicExpiryDate': new FormGroup({
        'dayExpiry': new FormControl(null, Validators.required),
        'monthExpiry': new FormControl(null, Validators.required),
        'yearExpiry': new FormControl(null, Validators.required),
      }, CustomValidators.dateValidator),

      'tc3Type': new FormControl(null, Validators.required),
      'tc3PeriodicNumberSubseq': new FormControl (null, [ Validators.required, Validators.maxLength(75) ]),
      'tc3PeriodicExpiryDateSubseq': new FormGroup({
        'dayExpirySubseq': new FormControl(null, Validators.required),
        'monthExpirySubseq': new FormControl(null, Validators.required),
        'yearExpirySubseq': new FormControl(null, Validators.required),
      }, CustomValidators.dateValidator),

      'memosApply': new FormGroup({
        'isMemo': new FormControl (null, Validators.required),
        'isNotMemo': new FormControl (null, Validators.required)
      }),

      'listStatementApplicable': new FormGroup({
        'applicable': new FormControl (null, Validators.required),
        'notApplicable': new FormControl (null, Validators.required)
      }),

      'batteryListNumber': new FormControl (null, [ Validators.required, Validators.maxLength(8) ]),
      'brakeDeclarationIssuer': new FormControl (null, Validators.required),
      'brakeEndurance': new FormControl (null, Validators.required),
      'brakeDeclarationsSeen': new FormControl (null, Validators.required),
      'declarationsSeen': new FormControl (null, Validators.required),
      'weight': new FormControl (null, Validators.required),
      'certificateReq': new FormGroup({
        'yesCert': new FormControl (null, Validators.required),
        'noCert': new FormControl (null, Validators.required)
      }),
      'adr-more-detail': new FormControl (null, Validators.required),

    });

  }

  ngOnDestroy() {
    if (this.techRecordsSubscription) {
      this.techRecordsSubscription.unsubscribe();
    }
  }

  public searchTechRecords(q: string) {
    this.isLoading = true;
    this.searchIdentifier = q;
    this._store.dispatch(new GetVehicleTechRecordModelHavingStatusAll(q));
    this._store.dispatch(new GetVehicleTestResultModel(q));
  }

  public togglePanel() {
    for (let panel of this.panels) {
      panel.isOpened = !this.allOpened;
    }
    this.allOpened = !this.allOpened;
  }

  public isNullOrEmpty(str){
    return (typeof str==='string' || str==null) ? !str||!str.trim():false;
  }

  public adrEdit($event){
    this.changeLabel = "Save technical record";
    this.isSubmit    = true;
    this.adrData     = false;
    this.showCheck   = !this.showCheck;
  }

  public cancelAddrEdit(){
    this.changeLabel   = "Change technical record";
    this.adrData       = true;
    this.showCheck     = !this.showCheck;
    this.isSubmit      = false;
  }

  public switchAdrDisplay($event){
    if ($event.currentTarget.value === 'yes') {
      this.adrData = !this.adrData;
      this.checkValue = $event.currentTarget.value;
    } else if ($event.currentTarget.value === 'no') {
      this.adrData = !this.adrData;
      this.checkValue = $event.currentTarget.value;
    }
  }

  onAddUN(){
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.adrDetailsForm.get('productListUnNo')).push(control);
  }

  addAGuidanceNote(){

  }

  addSubsequentInspection(){
    this.subsequentInspection = true;
  }

  onVTypeChange($event){
    console.log($event.currentTarget.value);
  }

  onSubmit(){
    // before PUT don't forget: Date (DD MM YYYY), converted to YYYY-MM-DD upon saving (as per ACs) -> this.adrDetailsForm.approvalDate
    console.log(this.adrDetailsForm);
  }

}
