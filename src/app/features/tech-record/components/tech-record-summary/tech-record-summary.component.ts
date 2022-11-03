import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { BodyComponent } from '@forms/custom-sections/body/body.component';
import { DimensionsComponent } from '@forms/custom-sections/dimensions/dimensions.component';
import { WeightsComponent } from '@forms/custom-sections/weights/weights.component';
import { FormNode, FormNodeOption } from '@forms/services/dynamic-form.types';
import { TrlBrakes } from '@forms/templates/trl/trl-brakes.template';
import { HgvTechRecord } from '@forms/templates/hgv/hgv-tech-record.template';
import { Axle, TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { ApplicantDetails } from '@forms/templates/general/applicant-details.template';
import { DocumentsTemplate } from '@forms/templates/general/documents.template';
import { getDimensionsMinMaxSection, getDimensionsSection } from '@forms/templates/general/dimensions.template';
import { getTyresSection } from '@forms/templates/general/tyres.template';
import { getTypeApprovalSection } from '@forms/templates/general/approval-type.template';
import { hgvAndTrlBodyTemplate } from '@forms/templates/hgv/hgv-trl-body.template';
import { HgvWeight } from '@forms/templates/hgv/hgv-weight.template';
import { NotesTemplate } from '@forms/templates/general/notes.template';
import { ManufacturerTemplate } from '@forms/templates/general/manufacturer.template';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { PsvBodyTemplate } from '@forms/templates/psv/psv-body.template';
import { PsvDdaTemplate } from '@forms/templates/psv/psv-dda.template';
import { PsvBrakeSection } from '@forms/templates/psv/psv-brake.template';
import { PsvBrakeSectionWheelsHalfLocked } from '@forms/templates/psv/psv-brake-wheels-half-locked.template';
import { PsvBrakeSectionWheelsNotLocked } from '@forms/templates/psv/psv-brake-wheels-not-locked.template';
import { PsvNotes } from '@forms/templates/psv/psv-notes.template';
import { PsvWeight } from '@forms/templates/psv/psv-weight.template';
import { getPsvTechRecord } from '@forms/templates/psv/psv-tech-record.template';
import { reasonForCreationSection } from '@forms/templates/general/resonForCreation.template';
import { Store } from '@ngrx/store';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { TrlTechRecordTemplate } from '@forms/templates/trl/trl-tech-record.template';
import { TrlPurchasers } from '@forms/templates/trl/trl-purchaser.template';
import { TrlWeight } from '@forms/templates/trl/trl-weight.template';
import { TrlAuthIntoServiceTemplate } from '@forms/templates/trl/trl-auth-into-service.template';
import { TyresComponent } from '@forms/custom-sections/tyres/tyres.component';
import { updateEditingTechRecord } from '@store/technical-records';
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';
import { PsvMake, ReferenceDataResourceType } from '@models/reference-data.model';
import { ReferenceDataState } from '@store/reference-data/reducers/reference-data.reducer';
import { selectAllReferenceDataByResourceType, selectReferenceDataByResourceKey } from '@store/reference-data';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { Observable } from 'rxjs';
import { BodyTypeCode, bodyTypeCodeMap, BodyTypeDescription, bodyTypeMap } from '@models/body-type-enum';

@Component({
  selector: 'app-tech-record-summary',
  templateUrl: './tech-record-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecordSummaryComponent implements OnInit {
  @ViewChildren(DynamicFormGroupComponent) sections!: QueryList<DynamicFormGroupComponent>;
  @ViewChild(BodyComponent) body!: BodyComponent;
  @ViewChild(DimensionsComponent) dimensions!: DimensionsComponent;
  @ViewChild(WeightsComponent) weights!: WeightsComponent;
  @ViewChild(TyresComponent) tyres!: TyresComponent;

  @Input() vehicleTechRecord!: TechRecordModel;
  @Input() refDataState!: ReferenceDataState;
  @Input()
  set isEditing(value: boolean) {
    this._isEditing = value;
    this.toggleReasonForCreation();
    this.calculateVehicleModel();
  }
  @Output() formChange = new EventEmitter();

  private _isEditing: boolean = false;

  vehicleTechRecordCalculated!: TechRecordModel;
  sectionTemplates: Array<FormNode> = [];
  dtpNumbersFromRefData: FormNodeOption<string>[] = [];

  constructor(
    private store: Store<TechnicalRecordServiceState>,
    private optionsService: MultiOptionsService,
    private referenceDataStore: Store<ReferenceDataState>
  ) {}

  async ngOnInit(): Promise<void> {
    this.sectionTemplates = this.vehicleTemplates;
    this.toggleReasonForCreation();
    this.calculateVehicleModel();
    this.optionsService.loadOptions(ReferenceDataResourceType.PsvMake);
    this.psvMakes$.subscribe(data => data.map(i => this.dtpNumbersFromRefData.push({ value: i.dtpNumber, label: i.dtpNumber })));
    console.log(this.vehicleTechRecord);
  }

  get isEditing(): boolean {
    return this._isEditing;
  }

  get psvMakes$(): Observable<PsvMake[]> {
    return this.referenceDataStore.select(selectAllReferenceDataByResourceType(ReferenceDataResourceType.PsvMake)) as Observable<PsvMake[]>;
  }

  get psvFromDtp$() {
    return this.referenceDataStore.select(
      selectReferenceDataByResourceKey(ReferenceDataResourceType.PsvMake, this.vehicleTechRecordCalculated.brakes.dtpNumber as string)
    ) as Observable<PsvMake | undefined>;
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

  findAxleToRemove(axles: Axle[]): number {
    let previousAxleRow = 1;

    for (const ax of axles) {
      if (ax.axleNumber === previousAxleRow) {
        previousAxleRow += 1;
      } else {
        return ax.axleNumber! - 1;
      }
    }
    return axles.length + 1;
  }

  removeAxle(axleEvent: any): void {
    this.vehicleTechRecordCalculated = cloneDeep(this.vehicleTechRecordCalculated);

    const axleToRemove = this.findAxleToRemove(axleEvent.axles);

    this.vehicleTechRecordCalculated.axles = this.vehicleTechRecordCalculated.axles.filter(ax => {
      if (ax.axleNumber !== axleToRemove) {
        if (ax.axleNumber! > axleToRemove) {
          ax.axleNumber! -= 1;
        }
        return true;
      }
      return false;
    });
  }

  setBodyFields() {
    this.psvFromDtp$.subscribe(payload => {
      this.vehicleTechRecordCalculated.chassisMake = payload?.psvChassisMake;
      this.vehicleTechRecordCalculated.chassisModel = payload?.psvChassisModel;
      this.vehicleTechRecordCalculated.bodyMake = payload?.psvBodyMake;

      const code = payload?.psvBodyType.toLowerCase() as BodyTypeCode;

      this.vehicleTechRecordCalculated.bodyType = {
        description: bodyTypeCodeMap.get(code),
        code: code
      };
    });
  }

  handleFormState(event: any): void {
    if (event.axles && event.axles.length < this.vehicleTechRecordCalculated.axles.length) {
      this.removeAxle(event);
    } else {
      this.vehicleTechRecordCalculated = merge(cloneDeep(this.vehicleTechRecordCalculated), event);
    }

    if (event.brakes && (event.brakes.dtpNumber.length === 4 || event.brakes.dtpNumber.length === 6)) {
      this.setBodyFields();
    } else {
      this.vehicleTechRecordCalculated = merge(cloneDeep(this.vehicleTechRecordCalculated), event);
    }

    this.vehicleTechRecordCalculated.noOfAxles = this.vehicleTechRecordCalculated.axles.length;
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
      /*  3 */ getPsvTechRecord(this.dtpNumbersFromRefData),
      /*  4 */ getTypeApprovalSection(VehicleTypes.PSV),
      /*  5 */ PsvBrakeSection,
      /*  6 */ PsvBrakeSectionWheelsNotLocked,
      /*  7 */ PsvBrakeSectionWheelsHalfLocked,
      /*  8 */ PsvDdaTemplate,
      /*  9 */ DocumentsTemplate,
      /* 10 */ PsvBodyTemplate,
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
      /*  7 */ hgvAndTrlBodyTemplate,
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
      /*  7 */ hgvAndTrlBodyTemplate,
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
