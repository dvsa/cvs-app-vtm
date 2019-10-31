import {Component, HostBinding, OnInit} from '@angular/core';
import {initAll} from 'govuk-frontend';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {IAppState} from '../../store/state/app.state';
import {selectSelectedVehicleTestResultModel} from '../../store/selectors/VehicleTestResultModel.selectors';
import {selectVehicleTechRecordModelHavingStatusAll} from '../../store/selectors/VehicleTechRecordModel.selectors';

@Component({
  selector: 'app-technical-record-accordion',
  templateUrl: './technical-record-accordion.component.html',
  styleUrls: ['./technical-record-accordion.component.scss']
})

export class TechnicalRecordAccordionComponent implements OnInit {

  @HostBinding('@.disabled')

  public animationsDisabled = true;
  techRecordsJson$: Observable<any>;
  testResultJson$: Observable<any>;

  panels: {panel: string, isOpened: boolean}[] = [{panel: 'panel1', isOpened: false}, {panel: 'panel2', isOpened: false}, {panel: 'panel3', isOpened: false}, {panel: 'panel4', isOpened: false},
                                                  {panel: 'panel5', isOpened: false}, {panel: 'panel6', isOpened: false}, {panel: 'panel7', isOpened: false}, {panel: 'panel8', isOpened: false}];

  allOpened = false;
  color = 'red';

  constructor(private _store: Store<IAppState>) {
    this.techRecordsJson$ = this._store.select(selectVehicleTechRecordModelHavingStatusAll);
    this.testResultJson$ = this._store.select(selectSelectedVehicleTestResultModel);
  }

  ngOnInit() {
    initAll();
  }

  togglePanel(){
    for (let panel of this.panels){
      panel.isOpened = !this.allOpened;
    }
    this.allOpened = !this.allOpened;
  }

}
