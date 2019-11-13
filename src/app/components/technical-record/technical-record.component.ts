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
import {MatDialogConfig} from "@angular/material/dialog";
import {VehicleExistsDialogComponent} from "@app/vehicle-exists-dialog/vehicle-exists-dialog.component";
import {VEHICLE_TYPES} from "@app/app.enums";

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
  panels: {panel: string, isOpened: boolean}[] = [{panel: 'panel1', isOpened: false}, {panel: 'panel2', isOpened: false},{panel: 'panel3', isOpened: false},{panel: 'panel4', isOpened: false},
                                                  {panel: 'panel5', isOpened: false},{panel: 'panel6', isOpened: false},{panel: 'panel7', isOpened: false},{panel: 'panel8', isOpened: false},
                                                  {panel:'panel9',isOpened:false}];
  allOpened = false;
  color = 'red';
  isVisible: boolean  = false;
  isHidden: boolean   = true;
  changeLabel: string = "Change technical record";
  showCancel = false;

  adrDetailsForm: FormGroup;
  vehicleTypes: typeof VEHICLE_TYPES = VEHICLE_TYPES;

  constructor(private _store: Store<IAppState>) {
    this.techRecordsJson$ = this._store.select(selectVehicleTechRecordModelHavingStatusAll);
    this.testResultJson$ = this._store.select(selectSelectedVehicleTestResultModel);
  }

  ngOnInit() {
    initAll();

    this.adrDetailsForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'street': new FormControl(null, Validators.required),
      'town': new FormControl(null, Validators.required),
      'city': new FormControl(null, Validators.required),
      'postcode': new FormControl(null, Validators.required),
      'adrVehicleType': new FormControl(null, Validators.required),
      'approvalDate-day': new FormControl (null, Validators.required),
      'approvalDate-month': new FormControl (null, Validators.required),
      'approvalDate-year': new FormControl (null, Validators.required),
      'permittedDangerousGoods': new FormControl (null, Validators.required),
      'additionalNotes': new FormControl (null, Validators.required),
      'adrTypeApprovalNo': new FormControl (null, Validators.required)


    });

  }

  public searchTechRecords(q: string) {
    this.isLoading = true;
    this.searchIdentifier = q;
    this._store.dispatch(new GetVehicleTechRecordModelHavingStatusAll(q));
    this._store.dispatch(new GetVehicleTestResultModel(q));
  }

  togglePanel() {
    for (let panel of this.panels) {
      panel.isOpened = !this.allOpened;
    }
    this.allOpened = !this.allOpened;
  }

  isNullOrEmpty(str){
    return (typeof str==='string' || str==null) ? !str||!str.trim():false;
  }

  adrEdit(){
    this.isVisible = true;
    this.isHidden= false;
    this.changeLabel = "Save technical record";
    this.showCancel = true;
  }

  cancelAddrEdit(){
    this.showCancel = false;
    this.changeLabel = "Change technical record";

    // switch to view adr details if some
  }

  switchAdrDisplay($event){
    if ( $event.currentTarget.value === 'yes' ) {
      console.log('value', 'yes');
    } else if ( $event.currentTarget.value === 'no' ) {
      console.log('value', 'no');
    }
  }

  onSubmit(adrDetails){

    console.log(adrDetails.value);

  }



}
