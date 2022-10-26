import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { TrlBrakes } from '@forms/templates/trl/trl-brakes.template';
import { HgvTechRecord } from '@forms/templates/hgv/hgv-tech-record.template';
import { ApplicantDetails } from '@forms/templates/general/applicant-details.template';
import { PsvBrakeSectionWheelsHalfLocked } from '@forms/templates/psv/psv-brake-wheels-half-locked.template';
import { PsvBrakeSectionWheelsNotLocked } from '@forms/templates/psv/psv-brake-wheels-not-locked.template';
import { PsvBrakeSection } from '@forms/templates/psv/psv-brake.template';
import { PsvTechRecord } from '@forms/templates/psv/psv-tech-record.template';
import { TrlTechRecordTemplate } from '@forms/templates/trl/trl-tech-record.template';
import { Axle, TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { getTyresSection } from '@forms/templates/general/tyres.template';
import { getTypeApprovalSection } from '@forms/templates/general/approval-type.template';
import { getDimensionsMinMaxSection, getDimensionsSection } from '@forms/templates/general/dimensions.template';
import { getBodyTemplate as getBodySection } from '@forms/templates/general/body.template';
import { TrlPurchasers } from '@forms/templates/trl/trl-purchaser.template';
import { NotesTemplate } from '@forms/templates/general/notes.template';
import { DocumentsTemplate } from '@forms/templates/general/documents.template';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { TrlAuthIntoServiceTemplate } from '@forms/templates/trl/trl-auth-into-service.template';
import { ManufacturerTemplate } from '@forms/templates/general/manufacturer.template';
import { PsvDdaTemplate } from '@forms/templates/psv/psv-dda.template';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { reasonForCreationSection } from '@forms/templates/general/resonForCreation.template';
import cloneDeep from 'lodash.clonedeep';
import { Store } from '@ngrx/store';
import { updateEditingTechRecord } from '@store/technical-records';
import merge from 'lodash.merge';
import { WeightsComponent } from '@forms/custom-sections/weights/weights.component';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { DimensionsComponent } from '@forms/custom-sections/dimensions/dimensions.component';
import { PsvNotes } from '@forms/templates/psv/psv-notes.template';
import { PsvWeight } from '@forms/templates/psv/psv-weight.template';
import { HgvWeight } from '@forms/templates/hgv/hgv-weight.template';
import { TrlWeight } from '@forms/templates/trl/trl-weight.template';

@Component({
  selector: 'app-tech-record-summary[vehicleTechRecord]',
  templateUrl: './tech-record-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecordSummaryComponent implements OnInit {
  @ViewChildren(DynamicFormGroupComponent) sections!: QueryList<DynamicFormGroupComponent>;
  @ViewChild(DimensionsComponent) dimensions!: DimensionsComponent;
  @ViewChild(WeightsComponent) weights!: WeightsComponent;

  @Input() vehicleTechRecord!: TechRecordModel;

  private _isEditing: boolean = false;
  get isEditing(): boolean {
    return this._isEditing;
  }
  @Input()
  set isEditing(value: boolean) {
    this._isEditing = value;
    this.toggleReasonForCreation();
    this.calculateVehicleModel();
  }

  @Output() formChange = new EventEmitter();

  vehicleTechRecordCalculated!: TechRecordModel;

  sectionTemplates: Array<FormNode> = [];

  constructor(private store: Store<TechnicalRecordServiceState>) {}

  ngOnInit(): void {
    this.sectionTemplates = this.vehicleTemplates;
    this.calculateVehicleModel();
  }

  get vehicleTemplates(): Array<FormNode> {
    switch (this.vehicleTechRecord.vehicleType) {
      case VehicleTypes.PSV:
        return this.getPsvTemplates();
      case VehicleTypes.HGV:
        return this.getHgvTemplates();
      case VehicleTypes.TRL:
        return this.getTrlTemplates();
    }
  }

  toggleReasonForCreation(): void {
    if (this.isEditing) {
      this.sectionTemplates.unshift(reasonForCreationSection);
    } else {
      this.sectionTemplates.shift();
    }
  }

  calculateVehicleModel(): void {
    this.vehicleTechRecordCalculated = this.isEditing ? { ...cloneDeep(this.vehicleTechRecord), reasonForCreation: '' } : this.vehicleTechRecord;

    this.store.dispatch(updateEditingTechRecord({ techRecord: this.vehicleTechRecordCalculated }));
  }

  processAxleEvent(axleEvent: any): void {
    if (axleEvent.axles.length < this.vehicleTechRecordCalculated.axles.length) {
      this.vehicleTechRecordCalculated = cloneDeep(this.vehicleTechRecordCalculated);

      let previousAxleRow = 1;
      let axleToRemove = 0;
      axleEvent.axles.every((ax: Axle) => {
        if (ax.axleNumber === previousAxleRow) {
          previousAxleRow += 1;
        } else {
          axleToRemove = ax.axleNumber! - 1;
          return false;
        }
        axleToRemove = ax.axleNumber + 1;
        return true;
      });

      this.vehicleTechRecordCalculated.axles = this.vehicleTechRecordCalculated.axles.filter(ax => ax.axleNumber !== axleToRemove);

      this.vehicleTechRecordCalculated.axles.forEach((ax: Axle) => {
        if (ax.axleNumber! > axleToRemove) {
          ax.axleNumber! -= 1;
        }
      });
    } else {
      this.vehicleTechRecordCalculated = merge(cloneDeep(this.vehicleTechRecordCalculated), axleEvent);
    }
    this.vehicleTechRecordCalculated.noOfAxles = this.vehicleTechRecordCalculated.axles.length;
  }

  handleFormState(event: any): void {
    if (event.axles) {
      this.processAxleEvent(event);
    } else {
      this.vehicleTechRecordCalculated = merge(cloneDeep(this.vehicleTechRecordCalculated), event);
    }
    this.store.dispatch(updateEditingTechRecord({ techRecord: this.vehicleTechRecordCalculated }));
    this.formChange.emit();
  }

  // The 3 methods below initialize the array of sections that the *ngFor in the component's template will iterate over.
  // The order in which each section is introduced in the array will determine its order on the page when rendered.
  // Sections which use custom components need an empty FormNode object with 'name' and 'label' properties.

  getPsvTemplates(): Array<FormNode> {
    return [
      /*  1 */ // reasonForCreationSection added when editing
      /*  2 */ PsvNotes,
      /*  3 */ PsvTechRecord,
      /*  4 */ getTypeApprovalSection(VehicleTypes.PSV),
      /*  5 */ PsvBrakeSection,
      /*  6 */ PsvBrakeSectionWheelsNotLocked,
      /*  7 */ PsvBrakeSectionWheelsHalfLocked,
      /*  8 */ PsvDdaTemplate,
      /*  9 */ DocumentsTemplate,
      /* 10 */ getBodySection(VehicleTypes.PSV),
      /* 11 */ PsvWeight,
      /* 12 */ getTyresSection(VehicleTypes.PSV),
      /* 13 */ getDimensionsSection(VehicleTypes.PSV, this.vehicleTechRecord.noOfAxles, this.vehicleTechRecord.dimensions?.axleSpacing)
    ];
  }

  getHgvTemplates(): Array<FormNode> {
    return [
      /*  1 */ // reasonForCreationSection added when editing
      /*  2 */ NotesTemplate,
      /*  3 */ HgvTechRecord,
      /*  4 */ getTypeApprovalSection(VehicleTypes.HGV),
      /*  5 */ ApplicantDetails,
      /*  6 */ DocumentsTemplate,
      /*  7 */ getBodySection(VehicleTypes.HGV),
      /*  8 */ HgvWeight,
      /*  9 */ getTyresSection(VehicleTypes.HGV),
      /* 10 */ getDimensionsSection(VehicleTypes.HGV, this.vehicleTechRecord.noOfAxles, this.vehicleTechRecord.dimensions?.axleSpacing),
      /* 11 */ getDimensionsMinMaxSection(
        'Front of vehicle to 5th wheel coupling',
        'frontAxleTo5thWheelCouplingMin',
        'frontAxleTo5thWheelCouplingMax'
      ),
      /* 12 */ getDimensionsMinMaxSection('Front axle to 5th wheel', 'frontAxleTo5thWheelMin', 'frontAxleTo5thWheelMax'),
      /* 13 */ PlatesTemplate
    ];
  }

  getTrlTemplates(): Array<FormNode> {
    return [
      /*  1 */ // reasonForCreationSection added when editing
      /*  2 */ NotesTemplate,
      /*  3 */ TrlTechRecordTemplate,
      /*  4 */ getTypeApprovalSection(VehicleTypes.TRL),
      /*  5 */ ApplicantDetails,
      /*  6 */ DocumentsTemplate,
      /*  7 */ getBodySection(VehicleTypes.TRL),
      /*  8 */ TrlWeight,
      /*  9 */ getTyresSection(VehicleTypes.TRL),
      /* 10 */ TrlBrakes,
      /* 11 */ TrlPurchasers,
      /* 12 */ getDimensionsSection(VehicleTypes.TRL, this.vehicleTechRecord.noOfAxles, this.vehicleTechRecord.dimensions?.axleSpacing),
      /* 13 */ getDimensionsMinMaxSection('Coupling center to rear axle', 'couplingCenterToRearAxleMin', 'couplingCenterToRearAxleMax'),
      /* 14 */ getDimensionsMinMaxSection('Coupling center to rear trailer', 'couplingCenterToRearTrlMin', 'couplingCenterToRearTrlMax'),
      /* 15 */ PlatesTemplate,
      /* 16 */ TrlAuthIntoServiceTemplate,
      /* 17 */ ManufacturerTemplate
    ];
  }
}
