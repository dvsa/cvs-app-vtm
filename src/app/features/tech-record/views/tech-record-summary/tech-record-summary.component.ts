import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TechRecordModel, Brakes } from '@models/vehicle-tech-record.model';
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

@Component({
  selector: 'app-tech-record-summary',
  templateUrl: './tech-record-summary.component.html',
  styleUrls: ['./tech-record-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecordSummaryComponent implements OnInit {
  @Input() vehicleTechRecord?: TechRecordModel;
  currentBrakeRecord?: Brakes;
  vehicleSummaryTemplate!: FormNode;
  brakeTemplate!: FormNode;
  brakeTemplateWheelsNotLocked!: FormNode;
  brakeTemplateWheelsHalfLocked!: FormNode;
  approvalTypeTemplate!: FormNode;
  applicantDetailsTemplate!: FormNode;
  dimensionsTemplate?: FormNode;
  notesTemplate?: FormNode;
  documentsTemplate?: FormNode;

  ngOnInit(): void {
    this.vehicleTemplate();
    this.currentBrakeRecord = this.vehicleTechRecord?.brakes;
  }

  constructor() { }

  vehicleTemplate(): void {
    switch (this.vehicleTechRecord?.vehicleType) {
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
