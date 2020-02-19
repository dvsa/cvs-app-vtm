import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { AdrReasonModalComponent } from '@app/shared/adr-reason-modal/adr-reason-modal.component';
import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';

import { TechnicalRecordValuesMapper } from './technical-record.mapper';
import { TechRecord } from './../models/tech-record.model';
import { MetaData } from '@app/models/meta-data';

@Component({
  selector: 'vtm-technical-record',
  templateUrl: './technical-record.component.html',
  styleUrls: ['../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalRecordComponent implements OnInit {
  @HostBinding('@.disabled')
  animationsDisabled = true;

  editRecord: boolean;
  showAdrDetails: boolean;
  adrDisplayParams: { [key: string]: boolean };
  techRecord: FormGroup;

  searchIdentifier = '{none searched}';
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

  @Input() techRecordsJson: any;
  @Input() activeRecord: TechRecord;
  @Input() metaData: MetaData;
  @Input() testResultJson: any;
  @Output() submitTechRecord = new EventEmitter<TechRecord>();

  constructor(
    private dialog: MatDialog,
    private allowedValues: TechnicalRecordValuesMapper,
    public techRecHelpers: TechRecordHelpersService
  ) {}

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

  hasSecondaryVrms(vrms) {
    return vrms && vrms.length > 1 && vrms.filter((vrm) => vrm.isPrimary === false).length > 0;
  }

  adrEdit() {
    this.editRecord = true;
  }

  cancelAddrEdit() {
    this.editRecord = false;
    this.adrDisplayParams = { ...this.adrDisplayParams };

    const controlNames = Object.keys(this.techRecord.controls);
    for (let index = 0; index < controlNames.length; index++) {
      this.removeControl(controlNames[index]);
    }
  }

  removeControl(name: string): void {
    this.techRecord.removeControl(name);
    this.techRecord.updateValueAndValidity();
  }

  onSaveChanges({ valid }: { valid: boolean }) {
    if (valid) {
      const editedRecord: TechRecord = this.allowedValues.mapToAllowedValues(
        this.techRecord.getRawValue()
      );
      const mergedRecord: TechRecord = { ...this.activeRecord, ...editedRecord };

      const dialogRef = this.dialog.open(AdrReasonModalComponent, {
        width: '600px',
        data: {
          context: 'Enter reason for changing technical record'
        }
      });

      dialogRef.afterClosed().subscribe((reasonForChanges) => {
        mergedRecord.reasonForCreation = reasonForChanges;
        this.submitTechRecord.emit(mergedRecord);
      });
    }
  }
}
