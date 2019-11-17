import {Component, HostBinding, OnInit} from '@angular/core';
import {initAll} from 'govuk-frontend';
import {Store} from '@ngrx/store';
import {forkJoin, Observable} from 'rxjs';
import {selectSelectedVehicleTestResultModel} from '../../store/selectors/VehicleTestResultModel.selectors';
import {GetVehicleTestResultModel} from '../../store/actions/VehicleTestResultModel.actions';
import {IAppState} from '../../store/state/app.state';
import {selectVehicleTechRecordModelHavingStatusAll} from '../../store/selectors/VehicleTechRecordModel.selectors';
import {GetVehicleTechRecordModelHavingStatusAll} from '../../store/actions/VehicleTechRecordModel.actions';
import {FormControl, FormGroup, Validators} from "@angular/forms";
<<<<<<< HEAD
import {VEHICLE_TYPES} from "../../app.enums";
=======
import {VEHICLE_TYPES} from "@app/app.enums";
>>>>>>> 7720020bd7f54faa524454e60a284ef7d7160db9

@Component({
  selector: 'app-technical-record',
  templateUrl: './technical-record.component.html',
  styleUrls: ['./technical-record.component.scss']
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
  adrData: boolean;
  showCheck: boolean;
  checkValue: string;

  adrDetailsForm: FormGroup;
  vehicleTypes: typeof VEHICLE_TYPES = VEHICLE_TYPES;

  constructor(private _store: Store<IAppState>) {
    this.techRecordsJson$ = this._store.select(selectVehicleTechRecordModelHavingStatusAll);
    this.testResultJson$ = this._store.select(selectSelectedVehicleTestResultModel);
  }

  ngOnInit() {
    initAll();

    this.adrData = true;
    this.showCheck = false;

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
     if (this.checkValue=='yes'){
       this.adrData     = false;
     }
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
      console.log(this.checkValue=='yes');
    } else if ($event.currentTarget.value === 'no') {
      this.adrData = !this.adrData;
      console.log(this.checkValue=='yes');
    }
  }

  onSubmit(){
    console.log(this.adrDetailsForm);
  }

}
