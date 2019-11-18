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
import {AdrDetailsFormData} from "@app/components/technical-record/adr-details-form";

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
  panels: {panel: string, isOpened: boolean}[] = [{panel: 'panel1', isOpened: false}, {panel: 'panel2', isOpened: false},{panel: 'panel3', isOpened: false},{panel: 'panel4', isOpened: false},
                                                  {panel: 'panel5', isOpened: false},{panel: 'panel6', isOpened: false},{panel: 'panel7', isOpened: false},{panel: 'panel8', isOpened: false},
                                                  {panel:'panel9',isOpened:false}];
  allOpened = false;
  color = 'red';
  changeLabel: string = "Change technical record";
  isSubmit: boolean   = false;
  adrData: boolean    = true;
  showCheck: boolean  = false;
  subsequentInspection: boolean = false;
  compatibilityJ: boolean = false;
  isStatement: boolean = false;
  isBatteryApplicable: boolean = false;
  isBrakeDeclarationsSeen: boolean = false;
  isBrakeEndurance: boolean = false;
  vehicleType: string;
  isMandatory: boolean;

  techRecords: TechRecordModel[];

  adrDetailsForm: FormGroup;
  vehicleTypes: typeof VEHICLE_TYPES = VEHICLE_TYPES;

  constructor(private _store: Store<IAppState>) {
    this.techRecordsJson$ = this._store.select(selectVehicleTechRecordModelHavingStatusAll);
    this.testResultJson$ = this._store.select(selectSelectedVehicleTestResultModel);
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

    this.adrDetailsForm =  new FormGroup({
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
        'yes': new FormControl(null),
        'no': new FormControl(null)
      }),
      'additionalNotes': new FormControl(['']),
      'adrTypeApprovalNo': new FormControl(null),
      'tankManufacturer': new FormControl(null, [ Validators.maxLength(70), requiredIfValidator(() => this.adrDetailsForm.get('type').value.includes('battery')
        || this.adrDetailsForm.get('type').value.includes('tank'))]),
      'yearOfManufacture': new FormControl(null, [ Validators.maxLength(4), requiredIfValidator(() => this.adrDetailsForm.get('type').value.includes('battery')
        || this.adrDetailsForm.get('type').value.includes('tank'))] ),
      'tankManufacturerSerialNo': new FormControl(null, [ Validators.maxLength(50), requiredIfValidator(() => this.adrDetailsForm.get('type').value.includes('battery')
        || this.adrDetailsForm.get('type').value.includes('tank'))]),
      'tankTypeAppNo': new FormControl(null, [ Validators.maxLength(65),requiredIfValidator(() => this.adrDetailsForm.get('type').value.includes('battery')
        || this.adrDetailsForm.get('type').value.includes('tank'))]),
      'tankCode': new FormControl(null, [ Validators.maxLength(30), requiredIfValidator(() => this.adrDetailsForm.get('type').value.includes('battery')
        || this.adrDetailsForm.get('type').value.includes('tank'))]),
      'substancesPermitted': new FormGroup({
        'underTankCode': new FormControl(null),
        'classUN': new FormControl(null)
      },[requiredIfValidator(() => this.adrDetailsForm.get('type').value.includes('battery') || this.adrDetailsForm.get('type').value.includes('tank'))]),
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
      'batteryListNumber': new FormControl(null, [ Validators.maxLength(8), requiredIfValidator(() => this.adrDetailsForm.get('type').value.includes('battery'))]),
      'brakeDeclarationIssuer': new FormControl(null),
      'brakeEndurance': new FormControl(null),
      'brakeDeclarationsSeen': new FormControl(null),
      'declarationsSeen': new FormControl(null),
      'weight': new FormControl(null, requiredIfValidator(() => this.adrDetailsForm.get('brakeEndurance').value == "true")),
      'certificateReq': new FormGroup({
        'yesCert': new FormControl(null),
        'noCert': new FormControl(null)
      }),
      'adr-more-detail': new FormControl(null),
    });

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
    this.adrData = $event.currentTarget.value === 'true' ? !this.adrData : false;
  }

  onAddUN(){
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.adrDetailsForm.get('productListUnNo')).push(control);
  }

  addAGuidanceNote(){
   // see ticket CVSB-9220
  }

  addSubsequentInspection(){
    this.subsequentInspection = true;
  }

  onVTypeChange($event){
    this.isMandatory = this.vehicleType.includes('battery') || this.vehicleType.includes('tank');
  }

  onPermittedChange($event){
    this.compatibilityJ = $event.currentTarget.value=="6: 'Explosives (type 2)'" || $event.currentTarget.value=="7: 'Explosives (type 3)'";
  }

  selectReferenceNumberChange($event){
    this.isStatement = $event.currentTarget.value == "isStatement";
  }

  onBatteryApplicableChange($event){
    this.isBatteryApplicable = $event.currentTarget.value == "applicable";
  }

  onManufactureBreakChange($event){
    this.isBrakeDeclarationsSeen = $event.currentTarget.value == "true";
  }

  onBrakeEnduranceChange($event){
    this.isBrakeEndurance = $event.currentTarget.value == "true";
  }

  onSubmit(){
    // before PUT don't forget: Date (DD MM YYYY), converted to YYYY-MM-DD upon saving (as per ACs) -> this.adrDetailsForm.approvalDate
    // weight in KG -> divide by 1000

    console.log(this.adrDetailsForm);
  }

}
