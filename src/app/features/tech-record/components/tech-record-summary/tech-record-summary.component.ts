import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import { TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { getTyresSection } from '@forms/templates/general/tyres.template';
import { getTypeApprovalSection } from '@forms/templates/general/approval-type.template';
import { getDimensionsMinMaxSection, getDimensionsSection } from '@forms/templates/general/dimensions.template';
import { getBodyTemplate } from '@forms/templates/general/body.template';
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
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { DimensionsComponent } from '@forms/components/dimensions/dimensions.component';

@Component({
  selector: 'app-tech-record-summary[vehicleTechRecord]',
  templateUrl: './tech-record-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecordSummaryComponent implements OnInit {
  @ViewChildren(DynamicFormGroupComponent) sections!: QueryList<DynamicFormGroupComponent>;
  @ViewChild(DimensionsComponent) dimensions!: DimensionsComponent;

  @Input() vehicleTechRecord!: TechRecordModel;

  private _isEditable: boolean = false;
  get isEditable(): boolean {
    return this._isEditable;
  }
  @Input()
  set isEditable(value: boolean) {
    this._isEditable = value;
    this.calculateVehicleModel()
  }

  @Output() formChange = new EventEmitter();

  vehicleTechRecordCalculated!: TechRecordModel;

  sectionTemplates: Array<FormNode> = [];

  constructor(private store: Store<TechnicalRecordServiceState>) {}

  ngOnInit(): void {
    this.initializeVehicleTemplates();
    this.calculateVehicleModel()
  }

  initializeVehicleTemplates(): void {
    switch (this.vehicleTechRecord.vehicleType) {
      case 'psv':
        this.sectionTemplates = this.getPsvTemplates();
        break;
      case 'hgv':
        this.sectionTemplates = this.getHgvTemplates();
        break;
      case 'trl':
        this.sectionTemplates = this.getTrlTemplates();
        break;
    }
  }

  calculateVehicleModel(): void {
    this.vehicleTechRecordCalculated = this.isEditable
      ? { ...cloneDeep(this.vehicleTechRecord), reasonForCreation: '' }
      : this.vehicleTechRecord;

    this.store.dispatch(updateEditingTechRecord({techRecord: this.vehicleTechRecordCalculated}));
  }

  handleFormState(event: any): void {
    this.vehicleTechRecordCalculated = merge(cloneDeep(this.vehicleTechRecordCalculated), event)
    this.store.dispatch(updateEditingTechRecord({techRecord: this.vehicleTechRecordCalculated}));
    this.formChange.emit();
  }

  // The 3 methods below initialize the array of sections that the *ngFor in the component's template will iterate over.
  // The order in which each section is introduced in the array will determine its order on the page when rendered.
  // Sections which use custom components need an empty FormNode object with 'name' and 'label' properties.

  getPsvTemplates(): Array<FormNode> {
    return [
      /*  1 */ reasonForCreationSection,
      /*  2 */ PsvNotes,
      /*  3 */ PsvTechRecord,
      /*  4 */ getTypeApprovalSection(true),
      /*  5 */ PsvBrakeSection,
      /*  6 */ PsvBrakeSectionWheelsNotLocked,
      /*  7 */ PsvBrakeSectionWheelsHalfLocked,
      /*  8 */ PsvDdaTemplate,
      /*  9 */ PsvApplicantDetails,
      /* 10 */ DocumentsTemplate,
      /* 11 */ getBodyTemplate(true),
      /* 12 */ PsvGrossVehicleWeight,
      /* 13 */ PsvTrainWeight,
      /* 14 */ PsvAxleWeights,
      /* 15 */ getTyresSection(true),
      /* 16 */ getDimensionsSection(VehicleTypes.PSV, this.vehicleTechRecord.noOfAxles, this.vehicleTechRecord.dimensions?.axleSpacing),
    ];
  }

  getHgvTemplates(): Array<FormNode> {
    return [
      /*  1 */ NotesTemplate,
      /*  2 */ HgvTechRecord,
      /*  3 */ getTypeApprovalSection(),
      /*  4 */ DocumentsTemplate,
      /*  5 */ getBodyTemplate(),
      /*  6 */ HgvGrossVehicleWeight,
      /*  7 */ HgvGrossTrainWeight,
      /*  8 */ HgvMaxTrainWeight,
      /*  9 */ HgvAxleWeights,
      /* 10 */ getTyresSection(),
      /* 11 */ getDimensionsSection(VehicleTypes.HGV, this.vehicleTechRecord.noOfAxles, this.vehicleTechRecord.dimensions?.axleSpacing),
      /* 12 */ getDimensionsMinMaxSection(
        'Front of vehicle to 5th wheel coupling',
        'frontAxleTo5thWheelCouplingMin',
        'frontAxleTo5thWheelCouplingMax'
      ),
      /* 13 */ getDimensionsMinMaxSection('Front axle to 5th wheel', 'frontAxleTo5thWheelMin', 'frontAxleTo5thWheelMax'),
      /* 14 */ PlatesTemplate,
    ];
  }

  getTrlTemplates(): Array<FormNode> {
    return [
      /*  1 */ NotesTemplate,
      /*  2 */ TrlTechRecordTemplate,
      /*  3 */ getTypeApprovalSection(),
      /*  4 */ DocumentsTemplate,
      /*  5 */ getBodyTemplate(),
      /*  6 */ TrlGrossVehicleWeightTemplate,
      /*  7 */ TrlAxleWeightsTemplate,
      /*  8 */ getTyresSection(),
      /*  9 */ BrakesTemplate,
      /* 10 */ TrlPurchasers,
      /* 11 */ getDimensionsSection(VehicleTypes.TRL, this.vehicleTechRecord.noOfAxles, this.vehicleTechRecord.dimensions?.axleSpacing),
      /* 12 */ getDimensionsMinMaxSection('Coupling center to rear axle', 'couplingCenterToRearAxleMin', 'couplingCenterToRearAxleMax'),
      /* 13 */ getDimensionsMinMaxSection('Coupling center to rear trailer', 'couplingCenterToRearTrlMin', 'couplingCenterToRearTrlMax'),
      /* 14 */ PlatesTemplate,
      /* 15 */ TrlAuthIntoServiceTemplate,
      /* 16 */ TrlManufacturerTemplate
    ];
  }
}
