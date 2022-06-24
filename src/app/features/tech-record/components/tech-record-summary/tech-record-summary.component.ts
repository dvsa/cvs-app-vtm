import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { Brakes as BrakesTemplate } from '@forms/templates/hgv/hgv-brakes.template';
import { HgvTechRecord } from '@forms/templates/hgv/hgv-tech-record.template';
import { HgvAxleWeights } from '@forms/templates/hgv/hgv-axle-weights.template';
import { HgvGrossTrainWeight } from '@forms/templates/hgv/hgv-gross-train-weights.template';
import { HgvGrossVehicleWeight } from '@forms/templates/hgv/hgv-gross-vehicle-weights.template';
import { HgvMaxTrainWeight } from '@forms/templates/hgv/hgv-max-train-weights.template';
import { HgvTyres } from '@forms/templates/hgv/hgv-tyres.template';
import { PsvApplicantDetails } from '@forms/templates/psv/psv-applicant-details.template';
import { PsvApprovalTypeSection } from '@forms/templates/psv/psv-approval-type.template';
import { PsvAxleWeights } from '@forms/templates/psv/psv-axle-weights.template';
import { PsvBody } from '@forms/templates/psv/psv-body';
import { PsvBrakeSectionWheelsHalfLocked } from '@forms/templates/psv/psv-brake-wheels-half-locked.template';
import { PsvBrakeSectionWheelsNotLocked } from '@forms/templates/psv/psv-brake-wheels-not-locked.template';
import { PsvBrakeSection } from '@forms/templates/psv/psv-brake.template';
import { PsvDimensionsSection } from '@forms/templates/psv/psv-dimensions.template';
import { PsvDocuments } from '@forms/templates/psv/psv-document.template';
import { PsvGrossVehicleWeight } from '@forms/templates/psv/psv-gross-vehicle-weights.template';
import { PsvNotes } from '@forms/templates/psv/psv-notes.template';
import { PsvTechRecord } from '@forms/templates/psv/psv-tech-record.template';
import { PsvTyre } from '@forms/templates/psv/psv-tyre.template';
import { PsvTrainWeight } from '@forms/templates/psv/psv-train-weight.template';
import { TrlTechRecord } from '@forms/templates/trl/trl-tech-record.template';
import { TrlAxleWeights } from '@forms/templates/trl/trl-axle-weights.template';
import { TrlGrossVehicleWeight } from '@forms/templates/trl/trl-gross-vehicle-weights.template';
import { Brakes, TechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-tech-record-summary',
  templateUrl: './tech-record-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecordSummaryComponent implements OnInit {
  @Input() vehicleTechRecord?: TechRecordModel;
  currentBrakeRecord?: Brakes;
  vehicleSummaryTemplate!: FormNode;
  psvBrakeTemplate!: FormNode;
  brakeTemplateWheelsNotLocked!: FormNode;
  brakeTemplateWheelsHalfLocked!: FormNode;
  approvalTypeTemplate!: FormNode;
  applicantDetailsTemplate!: FormNode;
  dimensionsTemplate?: FormNode;
  notesTemplate?: FormNode;
  documentsTemplate?: FormNode;
  bodyTemplate?: FormNode;
  tyreTemplate?: FormNode;
  grossVehicleWeightTemplate?: FormNode;
  grossTrainWeightTemplate?: FormNode;
  maxTrainWeightTemplate?: FormNode;
  trainWeightTemplate?: FormNode;
  axleWeightsTemplate?: FormNode;
  tyresTemplate?: FormNode;
  brakesTemplate?: FormNode;

  ngOnInit(): void {
    this.vehicleTemplate();
    this.currentBrakeRecord = this.vehicleTechRecord?.brakes;
  }

  constructor() {}

  vehicleTemplate(): void {
    switch (this.vehicleTechRecord?.vehicleType) {
      case 'psv': {
        this.vehicleSummaryTemplate = PsvTechRecord;
        this.approvalTypeTemplate = PsvApprovalTypeSection;
        this.psvBrakeTemplate = PsvBrakeSection;
        this.brakeTemplateWheelsNotLocked = PsvBrakeSectionWheelsNotLocked;
        this.brakeTemplateWheelsHalfLocked = PsvBrakeSectionWheelsHalfLocked;
        this.dimensionsTemplate = PsvDimensionsSection;
        this.applicantDetailsTemplate = PsvApplicantDetails;
        this.documentsTemplate = PsvDocuments;
        this.notesTemplate = PsvNotes;
        this.bodyTemplate = PsvBody;
        this.tyreTemplate = PsvTyre;
        this.grossVehicleWeightTemplate = PsvGrossVehicleWeight;
        this.trainWeightTemplate = PsvTrainWeight;
        this.axleWeightsTemplate = PsvAxleWeights;
        break;
      }
      case 'hgv': {
        this.vehicleSummaryTemplate = HgvTechRecord;
        this.grossVehicleWeightTemplate = HgvGrossVehicleWeight;
        this.trainWeightTemplate = HgvGrossTrainWeight;
        this.maxTrainWeightTemplate = HgvMaxTrainWeight;
        this.axleWeightsTemplate = HgvAxleWeights;
        this.tyresTemplate = HgvTyres;
        break;
      }
      case 'trl': {
        this.vehicleSummaryTemplate = TrlTechRecord;
        this.axleWeightsTemplate = TrlAxleWeights;
        this.grossVehicleWeightTemplate = TrlGrossVehicleWeight;
        this.tyresTemplate = HgvTyres;
        this.brakesTemplate = BrakesTemplate;
        break;
      }
    }
  }
}
