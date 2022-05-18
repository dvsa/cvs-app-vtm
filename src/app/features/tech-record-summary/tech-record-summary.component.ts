import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel, Brakes } from '@models/vehicle-tech-record.model';
import { PsvTechRecord } from '../../forms/templates/psv/psv-tech-record.template';
import { HgvTechRecord } from '../../forms/templates/hgv/hgv-tech-record.template';
import { TrlTechRecord } from '../../forms/templates/trl/trl-tech-record.template';
import { FormNode } from '../../forms/services/dynamic-form.types';
import { PsvBrakeSection } from '@forms/templates/psv/psv-brake.template';
import { PsvBrakeSectionWheelsNotLocked } from '@forms/templates/psv/psv-brake-wheels-not-locked.template';
import { PsvBrakeSectionWheelsHalfLocked } from '@forms/templates/psv/psv-brake-wheels-half-locked.template';
import { PsvApprovalTypeSection } from '@forms/templates/psv/psv-approval-type.template';
import { PsvDimensionsSection } from '@forms/templates/psv/psv-dimensions.template';

@Component({
  selector: 'app-tech-record-summary',
  templateUrl: './tech-record-summary.component.html',
  styleUrls: ['./tech-record-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecordSummaryComponent implements OnInit {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  template!: FormNode;
  brakeTemplate!: FormNode;
  brakeTemplateWheelsNotLocked!: FormNode;
  brakeTemplateWheelsHalfLocked!: FormNode;
  approvalTypeTemplate!: FormNode;
  currentRecord?: TechRecordModel;
  currentBrakeRecord?: Brakes;
  dimensionsTemplate?: FormNode;


  ngOnInit(): void {
    this.vehicleTemplate();
    this.currentRecord = this.viewableTechRecord(this.vehicleTechRecord);
    this.currentBrakeRecord = this.currentRecord?.brakes;
  }

  constructor() { }

  /**
   * A function to get the correct tech record to create the summary display, this has a hierarchy
   * which is PROVISIONAL -> CURRENT -> ARCHIVED.
   * @param record This is a VehicleTechRecordModel passed in from the parent component
   * @returns returns the tech record of correct hierarchy precedence or if none exists returns undefined
   */
  viewableTechRecord(record?: VehicleTechRecordModel): TechRecordModel | undefined {
    let viewableTechRecord = record?.techRecord?.find((record) => record.statusCode === StatusCodes.PROVISIONAL);
    if (viewableTechRecord == undefined) {
      viewableTechRecord = record?.techRecord?.find((record) => record.statusCode === StatusCodes.CURRENT);
    }
    if (viewableTechRecord == undefined) {
      viewableTechRecord = record?.techRecord?.find((record) => record.statusCode === StatusCodes.ARCHIVED);
    }
    return viewableTechRecord;
  }

  get vehicleType(): string | undefined {
    return this.vehicleTechRecord?.techRecord.pop()?.vehicleType;
  }

  vehicleTemplate(): void {
    let viewableRecord = this.viewableTechRecord(this.vehicleTechRecord);
    switch (viewableRecord?.vehicleType) {
      case 'psv': {
        this.template = PsvTechRecord;
        this.approvalTypeTemplate = PsvApprovalTypeSection;
        this.dimensionsTemplate = PsvDimensionsSection;
        this.brakeTemplate = PsvBrakeSection;
        this.brakeTemplateWheelsNotLocked = PsvBrakeSectionWheelsNotLocked;
        this.brakeTemplateWheelsHalfLocked = PsvBrakeSectionWheelsHalfLocked;
        break;
      }
      case 'hgv': {
        this.template = HgvTechRecord;
        break;
      }
      case 'trl': {
        this.template = TrlTechRecord;
        break;
      }
      default: {
        break;
      }
    }
  }
}
