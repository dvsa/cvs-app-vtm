import {Component, HostBinding, OnInit} from '@angular/core';
import {initAll} from 'govuk-frontend';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {selectSelectedVehicleTestResultModel} from '../../store/selectors/VehicleTestResultModel.selectors';
import {GetVehicleTestResultModel} from '../../store/actions/VehicleTestResultModel.actions';
import {IAppState} from '../../store/state/app.state';
import {selectVehicleTechRecordModelHavingStatusAll} from '../../store/selectors/VehicleTechRecordModel.selectors';
import {GetVehicleTechRecordModelHavingStatusAll} from '../../store/actions/VehicleTechRecordModel.actions';

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
                                                  {panel: 'panel5', isOpened: false},{panel: 'panel6', isOpened: false},{panel: 'panel7', isOpened: false},{panel: 'panel8', isOpened: false}];
  allOpened = false;
  color = 'red';


  constructor(private _store: Store<IAppState>) {
    this.techRecordsJson$ = this._store.select(selectVehicleTechRecordModelHavingStatusAll);
    this.testResultJson$ = this._store.select(selectSelectedVehicleTestResultModel);
  }

  ngOnInit() {
    initAll();
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

  hasProperty(obj, prop){
    return obj.some( obj => obj['prop'] );
  }

}
