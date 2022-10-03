import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { Brakes as BrakesTemplate } from '@forms/templates/hgv/hgv-brakes.template';
import { HgvTechRecord } from '@forms/templates/hgv/hgv-tech-record.template';
import { HgvGrossTrainWeight } from '@forms/templates/hgv/hgv-gross-train-weights.template';
import { HgvMaxTrainWeight } from '@forms/templates/hgv/hgv-max-train-weights.template';
import { ApplicantDetails } from '@forms/templates/general/applicant-details.template';
import { getAxleWeights as getAxleWeightsSection } from '@forms/templates/general/axle-weights.template';
import { getGrossVehicleWeightsTemplate as getGrossVehicleWeightsSection } from '@forms/templates/general/gross-vehicle-weights.template'
import { PsvBrakeSectionWheelsHalfLocked } from '@forms/templates/psv/psv-brake-wheels-half-locked.template';
import { PsvBrakeSectionWheelsNotLocked } from '@forms/templates/psv/psv-brake-wheels-not-locked.template';
import { PsvBrakeSection } from '@forms/templates/psv/psv-brake.template';
import { PsvTechRecord } from '@forms/templates/psv/psv-tech-record.template';
import { PsvTrainWeight } from '@forms/templates/psv/psv-train-weight.template';
import { TrlTechRecordTemplate } from '@forms/templates/trl/trl-tech-record.template';
import { Brakes, TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { getTyresSection } from '@forms/templates/general/tyres.template';
import { getTypeApprovalSection } from '@forms/templates/general/approval-type.template';
import { getDimensionsMinMaxSection, getDimensionsSection } from '@forms/templates/general/dimensions.template';
import { getBodyTemplate as getBodySection } from '@forms/templates/general/body.template';
import { TrlPurchasers } from '@forms/templates/trl/trl-purchaser.template';
import { NotesTemplate } from '@forms/templates/general/notes.template';
import { DocumentsTemplate } from '@forms/templates/general/documents.template';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { TrlAuthIntoServiceTemplate } from '@forms/templates/trl/trl-auth-into-service.template';
import { TrlManufacturerTemplate } from '@forms/templates/trl/trl-manufacturer.template';
import { PsvDdaTemplate } from '@forms/templates/psv/psv-dda.template';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { reasonForCreationSection } from '@forms/templates/general/resonForCreation.template';
import cloneDeep from 'lodash.clonedeep';
import { Store } from '@ngrx/store';
import { updateEditingTechRecord } from '@store/technical-records';
import merge from 'lodash.merge';
import { PsvNotes } from '@forms/templates/psv/psv-notes.template';

@Component({
  selector: 'app-tech-record-summary',
  templateUrl: './tech-record-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecordSummaryComponent implements OnInit {
  @ViewChildren(DynamicFormGroupComponent) sections!: QueryList<DynamicFormGroupComponent>;
  @Input() isEditable: boolean = false;
  @Input() vehicleTechRecord?: TechRecordModel;
  @Output() formChange = new EventEmitter();
  vehicleTechRecordCalculated!: TechRecordModel;
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
  reasonForCreation?: FormNode;

  ngOnInit(): void {
    this.vehicleTemplate();
    this.currentBrakeRecord = this.vehicleTechRecord?.brakes;
    this.calculateVehicleModel()
  }

  constructor(private store:Store) {}

  @Input()
  set editable(isEditable: boolean){
    this.isEditable = isEditable;
    this.calculateVehicleModel()
  }

  calculateVehicleModel() {
    if(this.isEditable) {
      this.vehicleTechRecordCalculated = cloneDeep(this.vehicleTechRecord!);
      this.vehicleTechRecordCalculated.reasonForCreation = '';
    }
    else {
      this.vehicleTechRecordCalculated = this.vehicleTechRecord!;
    }
    this.store.dispatch(updateEditingTechRecord({techRecord: this.vehicleTechRecordCalculated}));
  }

  // @ts-ignore
  handleFormState(event) {
    this.vehicleTechRecordCalculated = merge(cloneDeep(this.vehicleTechRecordCalculated), event)
    this.store.dispatch(updateEditingTechRecord({techRecord: this.vehicleTechRecordCalculated!}));
    this.formChange.emit();
  }


  vehicleTemplate(): void {
    switch (this.vehicleTechRecord?.vehicleType) {
      case 'psv': {
        this.vehicleSummaryTemplate = PsvTechRecord;
        this.approvalTypeTemplate = getTypeApprovalSection(VehicleTypes.PSV);
        this.psvBrakeTemplate = PsvBrakeSection;
        this.brakeTemplateWheelsNotLocked = PsvBrakeSectionWheelsNotLocked;
        this.brakeTemplateWheelsHalfLocked = PsvBrakeSectionWheelsHalfLocked;
        this.ddaTemplate = PsvDdaTemplate;
        this.dimensionsTemplate = getDimensionsSection(
          VehicleTypes.PSV,
          this.vehicleTechRecord.noOfAxles,
          this.vehicleTechRecord.dimensions?.axleSpacing
        );
        this.documentsTemplate = DocumentsTemplate;
        this.notesTemplate = PsvNotes;
        this.reasonForCreation = reasonForCreationSection
        this.bodyTemplate = getBodySection(VehicleTypes.PSV);
        this.tyresTemplate = getTyresSection(VehicleTypes.PSV);
        this.grossVehicleWeightTemplate = getGrossVehicleWeightsSection(VehicleTypes.PSV);
        this.trainWeightTemplate = PsvTrainWeight;
        this.axleWeightsTemplate = getAxleWeightsSection(VehicleTypes.PSV);
        break;
      }
      case 'hgv': {
        this.vehicleSummaryTemplate = HgvTechRecord;
        this.approvalTypeTemplate = getTypeApprovalSection(VehicleTypes.HGV);
        this.bodyTemplate = getBodySection(VehicleTypes.HGV);
        this.grossVehicleWeightTemplate = getGrossVehicleWeightsSection(VehicleTypes.HGV);
        this.trainWeightTemplate = HgvGrossTrainWeight;
        this.maxTrainWeightTemplate = HgvMaxTrainWeight;
        this.axleWeightsTemplate = getAxleWeightsSection(VehicleTypes.HGV);
        this.tyresTemplate = getTyresSection(VehicleTypes.HGV);
        this.dimensionsTemplate = getDimensionsSection(
          VehicleTypes.HGV,
          this.vehicleTechRecord.noOfAxles,
          this.vehicleTechRecord.dimensions?.axleSpacing
        );
        this.applicantDetailsTemplate = ApplicantDetails;
        this.firstMinMaxTemplate = getDimensionsMinMaxSection(
          'Front of vehicle to 5th wheel coupling',
          'frontAxleTo5thWheelCouplingMin',
          'frontAxleTo5thWheelCouplingMax'
        );
        this.secondMinMaxTemplate = getDimensionsMinMaxSection('Front axle to 5th wheel', 'frontAxleTo5thWheelMin', 'frontAxleTo5thWheelMax');
        this.notesTemplate = NotesTemplate;
        this.documentsTemplate = DocumentsTemplate;
        this.platesTemplate = PlatesTemplate;
        this.reasonForCreation = reasonForCreationSection;
        break;
      }
      case 'trl': {
        this.vehicleSummaryTemplate = TrlTechRecordTemplate;
        this.approvalTypeTemplate = getTypeApprovalSection(VehicleTypes.TRL);
        this.bodyTemplate = getBodySection(VehicleTypes.TRL);
        this.axleWeightsTemplate = getAxleWeightsSection(VehicleTypes.TRL);
        this.grossVehicleWeightTemplate = getGrossVehicleWeightsSection(VehicleTypes.TRL);
        this.tyresTemplate = getTyresSection(VehicleTypes.TRL);
        this.brakesTemplate = BrakesTemplate;
        this.purchasersTemplate = TrlPurchasers;
        this.dimensionsTemplate = getDimensionsSection(
          VehicleTypes.TRL,
          this.vehicleTechRecord.noOfAxles,
          this.vehicleTechRecord.dimensions?.axleSpacing
        );
        this.applicantDetailsTemplate = ApplicantDetails;
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
        this.reasonForCreation = reasonForCreationSection;
        break;
      }
    }
  }
}
