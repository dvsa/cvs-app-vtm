import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel, Brakes } from '@models/vehicle-tech-record.model';
import { PsvTechRecord } from '../../../../forms/templates/psv/psv-tech-record.template';
import { HgvTechRecord } from '../../../../forms/templates/hgv/hgv-tech-record.template';
import { TrlTechRecord } from '../../../../forms/templates/trl/trl-tech-record.template';
import { FormNode } from '../../../../forms/services/dynamic-form.types';
import { PsvBrakeSection } from '@forms/templates/psv/psv-brake.template';
import { PsvBrakeSectionWheelsNotLocked } from '@forms/templates/psv/psv-brake-wheels-not-locked.template';
import { PsvBrakeSectionWheelsHalfLocked } from '@forms/templates/psv/psv-brake-wheels-half-locked.template';
import { PsvApprovalTypeSection } from '@forms/templates/psv/psv-approval-type.template';
import { PsvDimensionsSection } from '@forms/templates/psv/psv-dimensions.template';
import { PsvApplicantDetails } from '@forms/templates/psv/psv-applicant-details.template';
import { PsvDocuments } from '@forms/templates/psv/psv-document.template';
import { PsvNotes } from '@forms/templates/psv/psv-notes.template';
import { select, Store } from '@ngrx/store';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';

@Component({
  selector: 'app-tech-record-summary',
  templateUrl: './tech-record-summary.component.html',
  styleUrls: ['./tech-record-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecordSummaryComponent implements OnInit {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  vehicleSummaryTemplate!: FormNode;
  brakeTemplate!: FormNode;
  brakeTemplateWheelsNotLocked!: FormNode;
  brakeTemplateWheelsHalfLocked!: FormNode;
  approvalTypeTemplate!: FormNode;
  applicantDetailsTemplate!: FormNode;
  currentRecord?: TechRecordModel;
  currentBrakeRecord?: Brakes;
  dimensionsTemplate?: FormNode;
  notesTemplate?: FormNode;
  documentsTemplate?: FormNode;

  ngOnInit(): void {
    this.vehicleTemplate();
    this.currentRecord = this.viewableTechRecord(this.vehicleTechRecord);
    this.currentBrakeRecord = this.currentRecord?.brakes;
  }

  constructor(private store: Store) { }

  //use selector to get the tech record from the date time, not an input.

  /**
   * A function to get the correct tech record to create the summary display, this has a hierarchy
   * first it will try to use a date time if that exists then uses a default
   * which is PROVISIONAL -> CURRENT -> ARCHIVED.
   * @param record This is a VehicleTechRecordModel passed in from the parent component
   * @returns returns the tech record of correct hierarchy precedence or if none exists returns undefined
   */
  viewableTechRecord(record?: VehicleTechRecordModel): TechRecordModel | undefined {
    let viewableTechRecord = undefined;

    this.store.pipe(select(selectRouteNestedParams)).subscribe((params) => {
      const createdAt = params['techCreatedAt'] ?? '';
      viewableTechRecord = record?.techRecord?.find((record) => new Date(record.createdAt).getTime() == createdAt);
    });

    if (!viewableTechRecord) {
      viewableTechRecord = record?.techRecord?.find((record) => record.statusCode === StatusCodes.PROVISIONAL);
      if (viewableTechRecord == undefined) {
        viewableTechRecord = record?.techRecord?.find((record) => record.statusCode === StatusCodes.CURRENT);
      }
      if (viewableTechRecord == undefined) {
        viewableTechRecord = record?.techRecord?.find((record) => record.statusCode === StatusCodes.ARCHIVED);
      }
    }

    return viewableTechRecord;
  }

  get vehicleType(): string | undefined {
    return this.vehicleTechRecord?.techRecord.pop()?.vehicleType;
  }

  convertToUnix(date: Date): number {
    return new Date(date).getTime()
  }

  vehicleTemplate(): void {
    let viewableRecord = this.viewableTechRecord(this.vehicleTechRecord);
    switch (viewableRecord?.vehicleType) {
      case 'psv': {
        this.vehicleSummaryTemplate = PsvTechRecord;
        this.approvalTypeTemplate = PsvApprovalTypeSection;
        this.brakeTemplate = PsvBrakeSection;
        this.brakeTemplateWheelsNotLocked = PsvBrakeSectionWheelsNotLocked;
        this.brakeTemplateWheelsHalfLocked = PsvBrakeSectionWheelsHalfLocked;
        this.dimensionsTemplate = PsvDimensionsSection;
        this.applicantDetailsTemplate = PsvApplicantDetails;
        this.documentsTemplate = PsvDocuments;
        this.notesTemplate = PsvNotes;
        break;
      }
      case 'hgv': {
        this.vehicleSummaryTemplate = HgvTechRecord;
        break;
      }
      case 'trl': {
        this.vehicleSummaryTemplate = TrlTechRecord;
        break;
      }
      default: {
        break;
      }
    }
  }
}
