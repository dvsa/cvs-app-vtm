import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { AdrReasonModalComponent } from '@app/shared/adr-reason-modal/adr-reason-modal.component';
import { TechnicalRecordValuesMapper } from './technical-record.mapper';
import { TechRecord } from './../models/tech-record.model';
import { MetaData } from '@app/models/meta-data';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { TestResultModel } from '@app/models/test-result.model';
import { VIEW_STATE } from '@app/app.enums';

@Component({
  selector: 'vtm-technical-record',
  templateUrl: './technical-record.component.html',
  styleUrls: ['../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalRecordComponent implements OnInit {
  showAdrDetails: boolean;
  adrDisplayParams: { [key: string]: boolean };
  techRecord: FormGroup;
  allOpened = false;
  panels: { panel: string; isOpened: boolean }[] = [
    { panel: 'panel1', isOpened: false },
    { panel: 'panel2', isOpened: false },
    { panel: 'panel3', isOpened: false },
    { panel: 'panel4', isOpened: false },
    { panel: 'panel5', isOpened: false },
    { panel: 'panel6', isOpened: false },
    { panel: 'panel7', isOpened: false },
    { panel: 'panel8', isOpened: false },
    { panel: 'panel9', isOpened: false },
    { panel: 'panel10', isOpened: false }
  ];

  @Input() vehicleTechRecord: VehicleTechRecordModel;
  @Input() activeRecord: TechRecord;
  @Input() metaData: MetaData;
  @Input() editState: VIEW_STATE;
  @Input() canEdit: boolean;
  @Input() testResultJson: TestResultModel;
  @Output() submitTechRecord = new EventEmitter<TechRecord>();
  @Output() changeViewState = new EventEmitter<VIEW_STATE>();

  constructor(private dialog: MatDialog, private allowedValues: TechnicalRecordValuesMapper) {}

  ngOnInit() {
    this.techRecord = new FormGroup({});
    this.adrDisplayParams = { showAdrDetails: !!this.activeRecord.adrDetails };
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
    this.activeRecord = JSON.parse(JSON.stringify(this.activeRecord));
    this.adrDisplayParams = { ...{ showAdrDetails: !!this.activeRecord.adrDetails } };

    const controlNames = Object.keys(this.techRecord.controls);
    for (let index = 0; index < controlNames.length; index++) {
      this.techRecord.removeControl(controlNames[index]);
    }
    this.techRecord.updateValueAndValidity();
  }

  onSaveChanges({ valid, value }: { valid: boolean; value: any }) {
    // if (valid) { TODO: Re-enable during ADR Validation ticket

    const editedRecord: TechRecord = this.allowedValues.mapControlValuesToDataValues(
      JSON.parse(JSON.stringify(value))
    );
    const mergedRecord: TechRecord = { ...this.activeRecord, ...editedRecord };

    const dialogRef = this.dialog.open(AdrReasonModalComponent, {
      width: '600px',
      data: {
        context: 'Enter reason for changing technical record'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.isSave) {
        mergedRecord.reasonForCreation = result.data;
        this.submitTechRecord.emit(mergedRecord);
      }
    });
    // }
  }
}
