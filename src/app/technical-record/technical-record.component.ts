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
import { TechnicalRecordValuesMapper } from './technical-record-value.mapper';
import { TechRecord } from './../models/tech-record.model';
import { MetaData } from '@app/models/meta-data';
import {
  VehicleTechRecordModel,
  VehicleTechRecordEdit
} from '@app/models/vehicle-tech-record.model';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE, CREATE_STATE } from '@app/app.enums';

@Component({
  selector: 'vtm-technical-record',
  templateUrl: './technical-record.component.html',
  styleUrls: ['../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalRecordComponent implements OnChanges, OnInit {
  showAdrDetails: boolean;
  adrDisplayParams: { [key: string]: boolean };
  activeRecord: TechRecord;
  vehicleRecordFg: FormGroup;
  allOpened = false;
  panels: { panel: string; isOpened: boolean }[] = [
    { panel: 'Vehicle summary', isOpened: false },
    { panel: 'Body', isOpened: false },
    { panel: 'Weights', isOpened: false },
    { panel: 'Tyres', isOpened: false },
    { panel: 'Brakes', isOpened: false },
    { panel: 'Dimensions', isOpened: false },
    { panel: 'ADR', isOpened: false },
    { panel: 'Applicant', isOpened: false },
    { panel: 'Documents', isOpened: false },
    { panel: 'Purchaser', isOpened: false },
    { panel: 'Manufacturer', isOpened: false },
    { panel: 'Authorisation into service', isOpened: false },
    { panel: 'Letters of authorisation', isOpened: false },
    { panel: 'Documents', isOpened: false },
    { panel: 'Notes', isOpened: false },
    { panel: 'Technical record history', isOpened: false },
    { panel: 'Plates', isOpened: false }
  ];

  @Input() activeVehicleTechRecord: VehicleTechRecordEdit;
  @Input() vehicleTechRecord: VehicleTechRecordModel;
  @Input() metaData: MetaData;
  @Input() editState: VIEW_STATE;
  @Input() createState: CREATE_STATE;
  @Input() testResultJson: TestResultModel;
  @Output() submitVehicleRecord = new EventEmitter<VehicleTechRecordEdit>();
  @Output() changeViewState = new EventEmitter<VIEW_STATE>();

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private allowedValues: TechnicalRecordValuesMapper
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { activeVehicleTechRecord } = changes;
    if (activeVehicleTechRecord) {
      this.activeRecord = this.activeVehicleTechRecord.techRecord[0];
      this.adrDisplayParams = { showAdrDetails: !!this.activeRecord.adrDetails };
    }
  }

  ngOnInit() {
    this.vehicleRecordFg = this.fb.group({
      techRecord: this.fb.group({})
    });
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

  cancelTechRecordEdit() {
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
