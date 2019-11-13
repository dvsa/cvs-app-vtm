import {Component, HostBinding, OnInit} from '@angular/core';
import {initAll} from 'govuk-frontend';
import {Store} from '@ngrx/store';
import {forkJoin, Observable} from 'rxjs';
import {selectSelectedVehicleTestResultModel} from '../../store/selectors/VehicleTestResultModel.selectors';
import {GetVehicleTestResultModel} from '../../store/actions/VehicleTestResultModel.actions';
import {IAppState} from '../../store/state/app.state';
import {selectVehicleTechRecordModelHavingStatusAll} from '../../store/selectors/VehicleTechRecordModel.selectors';
import {GetVehicleTechRecordModelHavingStatusAll} from '../../store/actions/VehicleTechRecordModel.actions';
import {selectVehicleTechRecordModelHavingStatusAllDropDowns} from '../../store/selectors/VehicleTechRecordModel.selectors';
import {GetVehicleTechRecordModelHavingStatusAllDropDowns} from '../../store/actions/VehicleTechRecordModel.actions';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogConfig} from "@angular/material/dialog";
import {VehicleExistsDialogComponent} from "@app/vehicle-exists-dialog/vehicle-exists-dialog.component";
import {VEHICLE_TYPES} from "@app/app.enums";

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
  isVisible: boolean  = false;
  isHidden: boolean   = true;
  changeLabel: string = "Change technical record";
  showCancel: boolean = false;
  isSubmit: boolean   = false;

  adrDetailsForm: FormGroup;
  vehicleTypes: typeof VEHICLE_TYPES = VEHICLE_TYPES;

  constructor(private _store: Store<IAppState>) {
    this.techRecordsJson$ = this._store.select(selectVehicleTechRecordModelHavingStatusAll);
    this.testResultJson$ = this._store.select(selectSelectedVehicleTestResultModel);
    this.techRecordDropDowns$ = this._store.select(selectVehicleTechRecordModelHavingStatusAllDropDowns);
  }

  ngOnInit() {
    initAll();

    this.adrDetailsForm = new FormGroup({
      'applicantDetailsName': new FormControl(null, Validators.required),
      'applicantDetailsStreet': new FormControl(null, Validators.required),
      'applicantDetailsTown': new FormControl(null, Validators.required),
      'applicantDetailsCity': new FormControl(null, Validators.required),
      'applicantDetailsPostcode': new FormControl(null, Validators.required),
      'adrVehicleType': new FormControl(null, Validators.required),
      'approvalDate-day': new FormControl (null, Validators.required),
      'approvalDate-month': new FormControl (null, Validators.required),
      'approvalDate-year': new FormControl (null, Validators.required),
      'permittedDangerousGoods': new FormControl (null, Validators.required),
      'additionalNotes': new FormControl (null, Validators.required),
      'adrTypeApprovalNo': new FormControl (null, Validators.required),
      'tankManufacturer': new FormControl (null, Validators.required),
      'ownerTankManufacturer': new FormControl (null, Validators.required),
      'certificateReq': new FormGroup({
        'certificateReqYes': new FormControl (null, Validators.required),
        'certificateReqNo': new FormControl (null, Validators.required)
      }),
      'adr-more-detail': new FormControl (null, Validators.required)
    });

  }

  public searchTechRecords(q: string) {
    this.isLoading = true;
    this.searchIdentifier = q;
    this._store.dispatch(new GetVehicleTechRecordModelHavingStatusAll(q));
    this._store.dispatch(new GetVehicleTestResultModel(q));
    this._store.dispatch(new GetVehicleTechRecordModelHavingStatusAllDropDowns(q));
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
    this.isVisible = false;
    this.isHidden  = false;
    this.changeLabel = "Save technical record";
    this.showCancel  = true;
    this.isSubmit    = true;
  }

  public cancelAddrEdit(){
    this.showCancel = false;
    this.changeLabel = "Change technical record";
    this.isHidden = true;
    this.isVisible = true;
    this.isSubmit    = false;
  }

  public switchAdrDisplay($event){
    if ( $event.currentTarget.value === 'yes' ) {
      console.log('value', 'yes');
      //this.isHidden = false;
    } else if ( $event.currentTarget.value === 'no' ) {
      console.log('value', 'no');
      //this.isHidden = true;
    }
  }

  onSubmit(){
    console.log(this.adrDetailsForm);
  }

}
