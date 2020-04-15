import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { merge } from 'lodash';

import { AdrReasonModalComponent } from '@app/shared/adr-reason-modal/adr-reason-modal.component';
import { TechRecordHelperService } from '@app/technical-record/tech-record-helper.service';
import { TechnicalRecordValuesMapper } from './technical-record-value.mapper';
import { TechRecord } from './../models/tech-record.model';
import { MetaData } from '@app/models/meta-data';
import {
  VehicleTechRecordModel,
  VehicleTechRecordEdit
} from '@app/models/vehicle-tech-record.model';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';

@Component({
  selector: 'vtm-technical-record',
  templateUrl: './technical-record.component.html',
  styleUrls: ['../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalRecordComponent implements OnChanges, OnInit {
  @Input() activeVehicleTechRecord: VehicleTechRecordEdit;
  @Input() vehicleTechRecord: VehicleTechRecordModel;
  @Input() metaData: MetaData;
  @Input() currentState: VIEW_STATE;
  @Input() testResultJson: TestResultModel[];
  @Output() submitVehicleRecord = new EventEmitter<VehicleTechRecordEdit>();
  @Output() changeViewState = new EventEmitter<VIEW_STATE>();

  showAdrDetails: boolean;
  adrDisplayParams: { [key: string]: boolean };
  activeRecord: TechRecord;
  vehicleRecordFg: FormGroup;
  allOpened: boolean;
  viewOnlyState: boolean;
  editState: boolean;
  createState: boolean;
  isStandardVehicle: boolean;
  panels: { panel: string; isOpened: boolean }[];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private allowedValues: TechnicalRecordValuesMapper,
    public techRecHelper: TechRecordHelperService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { activeVehicleTechRecord, currentState } = changes;
    if (activeVehicleTechRecord) {
      this.activeRecord = this.activeVehicleTechRecord.techRecord[0];
      this.adrDisplayParams = { showAdrDetails: !!this.activeRecord.adrDetails };
    }

    if (currentState) {
      this.viewOnlyState = this.currentState === VIEW_STATE.VIEW_ONLY;
      this.editState = this.currentState === VIEW_STATE.EDIT;
      this.createState = this.currentState === VIEW_STATE.CREATE;
    }
  }

  ngOnInit() {
    this.vehicleRecordFg = this.fb.group({
      techRecord: this.fb.group({})
    });

    this.setPanelState(this.createState);

    this.isStandardVehicle = this.techRecHelper.isStandardVehicle(this.activeRecord.vehicleType);
  }

  setPanelState(toggleState: boolean) {
    this.allOpened = toggleState;
    this.panels = [
      { panel: 'Vehicle summary', isOpened: toggleState },
      { panel: 'Body', isOpened: toggleState },
      { panel: 'Weights', isOpened: toggleState },
      { panel: 'Tyres', isOpened: toggleState },
      { panel: 'Brakes', isOpened: toggleState },
      { panel: 'DDA', isOpened: toggleState },
      { panel: 'Dimensions', isOpened: toggleState },
      { panel: 'ADR', isOpened: toggleState },
      { panel: 'Applicant', isOpened: toggleState },
      { panel: 'Documents', isOpened: toggleState },
      { panel: 'Purchaser', isOpened: toggleState },
      { panel: 'Manufacturer', isOpened: toggleState },
      { panel: 'Authorisation into service', isOpened: toggleState },
      { panel: 'Letters of authorisation', isOpened: toggleState },
      { panel: 'Documents', isOpened: toggleState },
      { panel: 'Notes', isOpened: toggleState },
      { panel: 'Test history', isOpened: toggleState },
      { panel: 'Technical record history', isOpened: toggleState },
      { panel: 'Plates', isOpened: toggleState }
    ];
  }

  togglePanel() {
    for (const panel of this.panels) {
      panel.isOpened = !this.allOpened;
    }
    this.allOpened = !this.allOpened;
  }

  editTechRecord() {
    this.changeViewState.emit(VIEW_STATE.EDIT);
  }

  cancelTechRecord() {
    this.changeViewState.emit(VIEW_STATE.VIEW_ONLY);

    this.resetVehicleRecordFg();

    this.activeRecord = JSON.parse(JSON.stringify(this.activeVehicleTechRecord.techRecord[0]));
    this.adrDisplayParams = {
      ...{ showAdrDetails: !!this.activeVehicleTechRecord.techRecord[0].adrDetails }
    };
  }

  resetVehicleRecordFg() {
    const techGroup = this.vehicleRecordFg.get('techRecord') as FormGroup;
    const controlNames = Object.keys(techGroup.controls);

    for (let index = 0; index < controlNames.length; index++) {
      techGroup.removeControl(controlNames[index]);
    }
    this.vehicleRecordFg.reset();
    this.vehicleRecordFg.updateValueAndValidity();
  }

  onSaveChanges({ valid, value }: { valid: boolean; value: any }) {
    // if (valid) { TODO: Re-enable during ADR Validation ticket

    const editedVehicleRecord: VehicleTechRecordEdit = this.allowedValues.mapControlValuesToDataValues(
      JSON.parse(JSON.stringify(value))
    );

    const mergedRecord: VehicleTechRecordEdit = merge(
      {},
      this.activeVehicleTechRecord,
      editedVehicleRecord
    );

    const dialogRef = this.dialog.open(AdrReasonModalComponent, {
      width: '600px',
      data: {
        context: 'Enter reason for changing technical record'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.isSave) {
        mergedRecord.techRecord[0].reasonForCreation = result.data;
        this.submitVehicleRecord.emit(mergedRecord);
      }
    });
    // }
  }
}
