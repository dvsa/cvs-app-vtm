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

      this.allOpened = this.createState;
      this.panels = [
        { panel: 'Vehicle summary', isOpened: this.createState },
        { panel: 'Body', isOpened: this.createState },
        { panel: 'Weights', isOpened: this.createState },
        { panel: 'Tyres', isOpened: this.createState },
        { panel: 'Brakes', isOpened: this.createState },
        { panel: 'DDA', isOpened: this.createState },
        { panel: 'Dimensions', isOpened: this.createState },
        { panel: 'ADR', isOpened: this.createState },
        { panel: 'Applicant', isOpened: this.createState },
        { panel: 'Documents', isOpened: this.createState },
        { panel: 'Purchaser', isOpened: this.createState },
        { panel: 'Manufacturer', isOpened: this.createState },
        { panel: 'Authorisation into service', isOpened: this.createState },
        { panel: 'Letters of authorisation', isOpened: this.createState },
        { panel: 'Documents', isOpened: this.createState },
        { panel: 'Notes', isOpened: this.createState },
        { panel: 'Test history', isOpened: this.createState },
        { panel: 'Technical record history', isOpened: this.createState },
        { panel: 'Plates', isOpened: this.createState }
      ];
    }
  }

  ngOnInit() {
    this.vehicleRecordFg = this.fb.group({
      techRecord: this.fb.group({})
    });

    this.isStandardVehicle = this.techRecHelper.isStandardVehicle(this.activeRecord.vehicleType);
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
