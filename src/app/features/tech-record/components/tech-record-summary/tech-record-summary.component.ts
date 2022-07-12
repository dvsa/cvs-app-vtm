import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { Brakes as BrakesTemplate } from '@forms/templates/hgv/hgv-brakes.template';
import { HgvTechRecord } from '@forms/templates/hgv/hgv-tech-record.template';
import { HgvAxleWeights } from '@forms/templates/hgv/hgv-axle-weights.template';
import { HgvGrossTrainWeight } from '@forms/templates/hgv/hgv-gross-train-weights.template';
import { HgvGrossVehicleWeight } from '@forms/templates/hgv/hgv-gross-vehicle-weights.template';
import { HgvMaxTrainWeight } from '@forms/templates/hgv/hgv-max-train-weights.template';
import { PsvApplicantDetails } from '@forms/templates/psv/psv-applicant-details.template';
import { PsvAxleWeights } from '@forms/templates/psv/psv-axle-weights.template';
import { PsvBrakeSectionWheelsHalfLocked } from '@forms/templates/psv/psv-brake-wheels-half-locked.template';
import { PsvBrakeSectionWheelsNotLocked } from '@forms/templates/psv/psv-brake-wheels-not-locked.template';
import { PsvBrakeSection } from '@forms/templates/psv/psv-brake.template';
import { PsvGrossVehicleWeight } from '@forms/templates/psv/psv-gross-vehicle-weights.template';
import { PsvNotes } from '@forms/templates/psv/psv-notes.template';
import { PsvTechRecord } from '@forms/templates/psv/psv-tech-record.template';
import { PsvTrainWeight } from '@forms/templates/psv/psv-train-weight.template';
import { TrlTechRecordTemplate } from '@forms/templates/trl/trl-tech-record.template';
import { TrlAxleWeightsTemplate } from '@forms/templates/trl/trl-axle-weights.template';
import { TrlGrossVehicleWeightTemplate } from '@forms/templates/trl/trl-gross-vehicle-weights.template';
import { Brakes, TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { getTyresSection } from '@forms/templates/general/tyres.template';
import { getTypeApprovalSection } from '@forms/templates/general/approval-type.template';
import { getDimensionsMinMaxSection, getDimensionsSection } from '@forms/templates/general/dimensions.template';
import { getBodyTemplate } from '@forms/templates/general/body.template';
import { TrlPurchasers } from '@forms/templates/trl/trl-purcheser.template';
import { NotesTemplate } from '@forms/templates/general/notes.template';
import { DocumentsTemplate } from '@forms/templates/general/documents.template';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { TrlAuthIntoServiceTemplate } from '@forms/templates/trl/trl-auth-into-service.template';
import { TrlManufacturerTemplate } from '@forms/templates/trl/trl-manufacturer.template';
import { PsvDdaTemplate } from '@forms/templates/psv/psv-dda.template';

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
  grossVehicleWeightTemplate?: FormNode;
  grossTrainWeightTemplate?: FormNode;
  maxTrainWeightTemplate?: FormNode;
  trainWeightTemplate?: FormNode;
  axleWeightsTemplate?: FormNode;
  tyresTemplate?: FormNode;
  brakesTemplate?: FormNode;
  purchasersTemplate?: FormNode;
  hgvAndTrlDimensionsTemplate?: FormNode;
  firstMinMaxTemplate?: FormNode;
  secondMinMaxTemplate?: FormNode;
  platesTemplate?: FormNode;
  trlAuthIntoServiceTemplate?: FormNode;
  trlManufacturerTemplate?: FormNode;
  ddaTemplate?: FormNode;

  ngOnInit(): void {
    this.vehicleTemplate();
    this.currentBrakeRecord = this.vehicleTechRecord?.brakes;
  }

  constructor() {}

  vehicleTemplate(): void {
    switch (this.vehicleTechRecord?.vehicleType) {
      case 'psv': {
        this.vehicleSummaryTemplate = PsvTechRecord;
        this.approvalTypeTemplate = getTypeApprovalSection(true);
        this.psvBrakeTemplate = PsvBrakeSection;
        this.brakeTemplateWheelsNotLocked = PsvBrakeSectionWheelsNotLocked;
        this.brakeTemplateWheelsHalfLocked = PsvBrakeSectionWheelsHalfLocked;
        this.ddaTemplate = PsvDdaTemplate;
        this.dimensionsTemplate = getDimensionsSection(
          VehicleTypes.PSV,
          this.vehicleTechRecord?.noOfAxles,
          this.vehicleTechRecord?.dimensions?.axleSpacing
        );
        this.applicantDetailsTemplate = PsvApplicantDetails;
        this.documentsTemplate = DocumentsTemplate;
        this.notesTemplate = PsvNotes;
        this.bodyTemplate = getBodyTemplate(true);
        this.tyresTemplate = getTyresSection(true);
        this.grossVehicleWeightTemplate = PsvGrossVehicleWeight;
        this.trainWeightTemplate = PsvTrainWeight;
        this.axleWeightsTemplate = PsvAxleWeights;
        break;
      }
      case 'hgv': {
        this.vehicleSummaryTemplate = HgvTechRecord;
        this.approvalTypeTemplate = getTypeApprovalSection();
        this.bodyTemplate = getBodyTemplate();
        this.grossVehicleWeightTemplate = HgvGrossVehicleWeight;
        this.trainWeightTemplate = HgvGrossTrainWeight;
        this.maxTrainWeightTemplate = HgvMaxTrainWeight;
        this.axleWeightsTemplate = HgvAxleWeights;
        this.tyresTemplate = getTyresSection();
        this.dimensionsTemplate = getDimensionsSection(
          VehicleTypes.HGV,
          this.vehicleTechRecord?.noOfAxles,
          this.vehicleTechRecord?.dimensions?.axleSpacing
        );
        this.firstMinMaxTemplate = getDimensionsMinMaxSection(
          'Front of vehicle to 5th wheel coupling',
          'frontAxleTo5thWheelCouplingMin',
          'frontAxleTo5thWheelCouplingMax'
        );
        this.secondMinMaxTemplate = getDimensionsMinMaxSection('Front axle to 5th wheel', 'frontAxleTo5thWheelMin', 'frontAxleTo5thWheelMax');
        this.notesTemplate = NotesTemplate;
        this.documentsTemplate = DocumentsTemplate;
        this.platesTemplate = PlatesTemplate;
        break;
      }
      case 'trl': {
        this.vehicleSummaryTemplate = TrlTechRecordTemplate;
        this.approvalTypeTemplate = getTypeApprovalSection();
        this.bodyTemplate = getBodyTemplate();
        this.axleWeightsTemplate = TrlAxleWeightsTemplate;
        this.grossVehicleWeightTemplate = TrlGrossVehicleWeightTemplate;
        this.tyresTemplate = getTyresSection();
        this.brakesTemplate = BrakesTemplate;
        this.purchasersTemplate = TrlPurchasers;
        this.dimensionsTemplate = getDimensionsSection(
          VehicleTypes.TRL,
          this.vehicleTechRecord?.noOfAxles,
          this.vehicleTechRecord?.dimensions?.axleSpacing
        );
        this.firstMinMaxTemplate = getDimensionsMinMaxSection(
          'Coupling center to rear axle',
          'couplingCenterToRearAxleMin',
          'couplingCenterToRearAxleMax'
        );
        this.secondMinMaxTemplate = getDimensionsMinMaxSection(
          'Coupling center to rear trailer',
          'couplingCenterToRearTrlMin',
          'couplingCenterToRearTrlMax'
        );
        this.notesTemplate = NotesTemplate;
        this.documentsTemplate = DocumentsTemplate;
        this.platesTemplate = PlatesTemplate;
        this.trlAuthIntoServiceTemplate = TrlAuthIntoServiceTemplate;
        this.trlManufacturerTemplate = TrlManufacturerTemplate;
        break;
      }
    }
  }
}
