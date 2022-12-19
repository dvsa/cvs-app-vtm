import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { BodyComponent } from '@forms/custom-sections/body/body.component';
import { DimensionsComponent } from '@forms/custom-sections/dimensions/dimensions.component';
import { WeightsComponent } from '@forms/custom-sections/weights/weights.component';
import { FormNode, FormNodeOption } from '@forms/services/dynamic-form.types';
import { TrlBrakesTemplate } from '@forms/templates/trl/trl-brakes.template';
import { HgvTechRecord } from '@forms/templates/hgv/hgv-tech-record.template';
import { ApplicantDetails } from '@forms/templates/general/applicant-details.template';
import { PsvBrakesTemplate } from '@forms/templates/psv/psv-brakes.template';
import { TrlTechRecordTemplate } from '@forms/templates/trl/trl-tech-record.template';
import { Axle, AxleSpacing, TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { DocumentsTemplate } from '@forms/templates/general/documents.template';
import { NotesTemplate } from '@forms/templates/general/notes.template';
import { ManufacturerTemplate } from '@forms/templates/general/manufacturer.template';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { PsvBodyTemplate } from '@forms/templates/psv/psv-body.template';
import { PsvDdaTemplate } from '@forms/templates/psv/psv-dda.template';
import { PsvNotes } from '@forms/templates/psv/psv-notes.template';
import { PsvWeightsTemplate } from '@forms/templates/psv/psv-weight.template';
import { getPsvTechRecord } from '@forms/templates/psv/psv-tech-record.template';
import { Store } from '@ngrx/store';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';
import { TrlPurchasers } from '@forms/templates/trl/trl-purchaser.template';
import { TrlWeight } from '@forms/templates/trl/trl-weight.template';
import { TrlAuthIntoServiceTemplate } from '@forms/templates/trl/trl-auth-into-service.template';
import { TyresComponent } from '@forms/custom-sections/tyres/tyres.component';
import { updateEditingTechRecord } from '@store/technical-records';
import { TrlBrakesComponent } from '@forms/custom-sections/trl-brakes/trl-brakes.component';
import { PsvBrakesComponent } from '@forms/custom-sections/psv-brakes/psv-brakes.component';
import { tyresTemplateHgv } from '@forms/templates/hgv/hgv-tyres.template';
import { PsvTyresTemplate } from '@forms/templates/psv/psv-tyres.template';
import { tyresTemplateTrl } from '@forms/templates/trl/trl-tyres.template';
import { PsvDimensionsTemplate } from '@forms/templates/psv/psv-dimensions.template';
import { HgvDimensionsTemplate } from '@forms/templates/hgv/hgv-dimensions.template';
import { TrlDimensionsTemplate } from '@forms/templates/trl/trl-dimensions.template';
import { BodyTypeCode, bodyTypeCodeMap } from '@models/body-type-enum';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { ReferenceDataResourceType, PsvMake } from '@models/reference-data.model';
import { ReferenceDataState, selectAllReferenceDataByResourceType, selectReferenceDataByResourceKey } from '@store/reference-data';
import { map, Observable, take } from 'rxjs';
import { HgvAndTrlBodyTemplate } from '@forms/templates/general/hgv-trl-body.template';
import { HgvWeight } from '@forms/templates/hgv/hgv-weight.template';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { PsvTypeApprovalTemplate } from '@forms/templates/psv/psv-approval-type.template';
import { HgvAndTrlTypeApprovalTemplate } from '@forms/templates/general/approval-type.template';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { reasonForCreationSection } from '@forms/templates/test-records/section-templates/reasonForCreation/reasonForCreation.template';

@Component({
  selector: 'app-tech-record-summary',
  templateUrl: './tech-record-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tech-record-summary.component.scss']
})
export class TechRecordSummaryComponent implements OnInit {
  @ViewChildren(DynamicFormGroupComponent) sections!: QueryList<DynamicFormGroupComponent>;
  @ViewChild(BodyComponent) body!: BodyComponent;
  @ViewChild(DimensionsComponent) dimensions!: DimensionsComponent;
  @ViewChild(PsvBrakesComponent) psvBrakes?: PsvBrakesComponent;
  @ViewChild(TrlBrakesComponent) trlBrakes?: TrlBrakesComponent;
  @ViewChild(TyresComponent) tyres!: TyresComponent;
  @ViewChild(WeightsComponent) weights!: WeightsComponent;

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
  middleIndex = 0;

  constructor(
    private technicalRecordService: TechnicalRecordService,
    private store: Store<TechnicalRecordServiceState>,
    private optionsService: MultiOptionsService,
    private referenceDataStore: Store<ReferenceDataState>,
    private referenceDataService: ReferenceDataService
  ) {}

  ngOnInit(): void {
    this.sectionTemplates = this.vehicleTemplates;
    this.referenceDataService.removeTyreSearch();
    this.toggleReasonForCreation();
    this.calculateVehicleModel();
    this.optionsService.loadOptions(ReferenceDataResourceType.PsvMake);
    this.psvMakes$.subscribe(data => data.map(i => this.dtpNumbersFromRefData.push({ value: i.dtpNumber, label: i.dtpNumber })));
    this.middleIndex = Math.floor(this.sectionTemplates.length / 2);
  }

  get isEditing(): boolean {
    return this._isEditing;
  }

  get psvMakes$(): Observable<PsvMake[]> {
    return this.referenceDataStore.select(selectAllReferenceDataByResourceType(ReferenceDataResourceType.PsvMake)) as Observable<PsvMake[]>;
  }

  get psvFromDtp$(): Observable<PsvMake | undefined> {
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
      // TODO: Create light vehicle specific functions for this
      default:
        return this.getPsvTemplates();
    }
  }

  toggleReasonForCreation(): void {
    if (this.isEditing) {
      this.sectionTemplates.unshift(reasonForCreationSection);
    } else if (this.sectionTemplates[0]?.name === 'reasonForCreationSection') {
      this.sectionTemplates.shift();
    }
  }

  calculateVehicleModel(): void {
    this.isEditing
      ? this.technicalRecordService.editableTechRecord$
          .pipe(
            //Need to check that the editing tech record has more than just reason for creation on and is the full object.
            map(data => (data && Object.keys(data).length > 1 ? cloneDeep(data) : { ...cloneDeep(this.vehicleTechRecord), reasonForCreation: '' })),
            take(1)
          )
          .subscribe(data => {
            this.vehicleTechRecordCalculated = data;
            this.normaliseVehicleTechRecordAxles();
          })
      : (this.vehicleTechRecordCalculated = { ...this.vehicleTechRecord, reasonForCreation: '' });
    this.store.dispatch(updateEditingTechRecord({ techRecord: this.vehicleTechRecordCalculated }));
  }

  handleFormState(event: any): void {
    this.vehicleTechRecordCalculated = cloneDeep(this.vehicleTechRecordCalculated);

    if (event.axles && event.axles.length < this.vehicleTechRecordCalculated.axles.length) {
      this.removeAxle(event);
    } else if (event.axles && this.vehicleTechRecordCalculated.axles.length < event.axles.length) {
      this.addAxle(event);
    } else {
      this.vehicleTechRecordCalculated = merge(this.vehicleTechRecordCalculated, event);
    }

    if (event.brakes?.dtpNumber && (event.brakes.dtpNumber.length === 4 || event.brakes.dtpNumber.length === 6)) {
      this.setBodyFields();
    }

    if (this.vehicleTechRecord.vehicleType === VehicleTypes.PSV && (event.grossKerbWeight || event.grossLadenWeight || event.brakes)) {
      this.setBrakesForces();
    }

    this.vehicleTechRecordCalculated.noOfAxles = this.vehicleTechRecordCalculated.axles.length ?? 0;
    this.store.dispatch(updateEditingTechRecord({ techRecord: this.vehicleTechRecordCalculated }));
    this.formChange.emit();
  }

  generateAxleSpacing(numberOfAxles: number, setOriginalValues: boolean = false, axleSpacingOriginal?: AxleSpacing[]): AxleSpacing[] {
    let axleSpacing: AxleSpacing[] = [];

    let axleNumber = 1;
    while (axleNumber < numberOfAxles) {
      axleSpacing.push({
        axles: `${axleNumber}-${axleNumber + 1}`,
        value: setOriginalValues && axleSpacingOriginal![axleNumber - 1] ? axleSpacingOriginal![axleNumber - 1].value : null
      });
      axleNumber++;
    }

    return axleSpacing;
  }

  addAxle(event: any): void {
    this.vehicleTechRecordCalculated = merge(this.vehicleTechRecordCalculated, event);
    if (this.vehicleTechRecord.vehicleType !== VehicleTypes.PSV && this.vehicleTechRecordCalculated.dimensions) {
      this.vehicleTechRecordCalculated.dimensions.axleSpacing = this.generateAxleSpacing(
        this.vehicleTechRecordCalculated.axles.length,
        true,
        this.vehicleTechRecordCalculated.dimensions.axleSpacing
      );
    }
  }

  removeAxle(axleEvent: any): void {
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

    if (this.vehicleTechRecord.vehicleType !== VehicleTypes.PSV && this.vehicleTechRecordCalculated.dimensions) {
      this.vehicleTechRecordCalculated.dimensions.axleSpacing = this.generateAxleSpacing(this.vehicleTechRecordCalculated.axles.length);
    }
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

  normaliseVehicleTechRecordAxles() {
    if (this.vehicleTechRecordCalculated.vehicleType !== VehicleTypes.PSV) {
      const vehicleAxles = this.vehicleTechRecordCalculated.axles;
      const vehicleAxleSpacings = this.vehicleTechRecordCalculated.dimensions?.axleSpacing;

      //axles = axlespacings + 1
      if (vehicleAxles && vehicleAxleSpacings) {
        if (vehicleAxles.length > vehicleAxleSpacings.length + 1) {
          this.vehicleTechRecordCalculated.dimensions!.axleSpacing = this.generateAxleSpacing(vehicleAxles.length, true, vehicleAxleSpacings);
        } else if (vehicleAxles.length < vehicleAxleSpacings.length + 1) {
          this.vehicleTechRecordCalculated.axles = this.generateAxlesFromAxleSpacings(
            this.vehicleTechRecordCalculated.vehicleType,
            vehicleAxleSpacings.length,
            vehicleAxles
          );
        }
      } else if (vehicleAxles && !vehicleAxleSpacings) {
        this.vehicleTechRecordCalculated.dimensions!.axleSpacing = this.generateAxleSpacing(vehicleAxles.length);
      } else if (!vehicleAxles && vehicleAxleSpacings) {
        this.vehicleTechRecordCalculated.axles = this.generateAxlesFromAxleSpacings(
          this.vehicleTechRecordCalculated.vehicleType,
          vehicleAxleSpacings.length
        );
      }
    }
  }

  generateAxlesFromAxleSpacings(vehicleType: VehicleTypes, vehicleAxleSpacingsLength: number, previousAxles?: Axle[]): Axle[] {
    const axles = previousAxles ?? [];

    let i = previousAxles ? previousAxles.length : 0;

    for (i; i < vehicleAxleSpacingsLength + 1; i++) {
      axles.push(this.generateAxleObject(vehicleType, i + 1));
    }

    return axles;
  }

  generateAxleObject(vehicleType: VehicleTypes, axleNumber: number): Axle {
    const weights =
      vehicleType === VehicleTypes.PSV
        ? {
            kerbWeight: null,
            ladenWeight: null,
            gbWeight: null,
            designWeight: null
          }
        : {
            gbWeight: null,
            eecWeight: null,
            designWeight: null
          };

    const tyres = { tyreSize: null, speedCategorySymbol: null, fitmentCode: null, dataTrAxles: null, plyRating: null, tyreCode: null };

    return {
      axleNumber,
      weights,
      tyres
    };
  }

  setBodyFields(): void {
    this.psvFromDtp$.subscribe(payload => {
      const code = payload?.psvBodyType.toLowerCase() as BodyTypeCode;

      this.vehicleTechRecordCalculated.bodyType = { code, description: bodyTypeCodeMap.get(code) };
      this.vehicleTechRecordCalculated.bodyMake = payload?.psvBodyMake;
      this.vehicleTechRecordCalculated.chassisMake = payload?.psvChassisMake;
      this.vehicleTechRecordCalculated.chassisModel = payload?.psvChassisModel;
    });
  }

  get brakeCodePrefix(): string {
    const prefix = `${Math.round(this.vehicleTechRecordCalculated!.grossLadenWeight! / 100)}`;

    return prefix.length <= 2 ? '0' + prefix : prefix;
  }

  setBrakesForces(): void {
    this.vehicleTechRecordCalculated.brakes = {
      ...this.vehicleTechRecordCalculated.brakes,
      brakeCode: this.brakeCodePrefix + this.vehicleTechRecordCalculated.brakes.brakeCodeOriginal,
      brakeForceWheelsNotLocked: {
        serviceBrakeForceA: Math.round(((this.vehicleTechRecord.grossLadenWeight || 0) * 16) / 100),
        secondaryBrakeForceA: Math.round(((this.vehicleTechRecord.grossLadenWeight || 0) * 22.5) / 100),
        parkingBrakeForceA: Math.round(((this.vehicleTechRecord.grossLadenWeight || 0) * 45) / 100)
      },
      brakeForceWheelsUpToHalfLocked: {
        serviceBrakeForceB: Math.round(((this.vehicleTechRecord.grossKerbWeight || 0) * 16) / 100),
        secondaryBrakeForceB: Math.round(((this.vehicleTechRecord.grossKerbWeight || 0) * 25) / 100),
        parkingBrakeForceB: Math.round(((this.vehicleTechRecord.grossKerbWeight || 0) * 50) / 100)
      }
    };
  }

  // The 3 methods below initialize the array of sections that the *ngFor in the component's template will iterate over.
  // The order in which each section is introduced in the array will determine its order on the page when rendered.
  // Sections which use custom components require a FormNode object with 'name' and 'label' properties.

  getPsvTemplates(): Array<FormNode> {
    return [
      /*  1 */ // reasonForCreationSection added when editing
      /*  2 */ PsvNotes,
      /*  3 */ getPsvTechRecord(this.dtpNumbersFromRefData, this._isEditing),
      /*  4 */ PsvTypeApprovalTemplate,
      /*  5 */ PsvBrakesTemplate,
      /*  6 */ PsvDdaTemplate,
      /*  7 */ DocumentsTemplate,
      /*  8 */ PsvBodyTemplate,
      /*  9 */ PsvWeightsTemplate,
      /* 10 */ PsvTyresTemplate,
      /* 11 */ PsvDimensionsTemplate
    ];
  }

  getHgvTemplates(): Array<FormNode> {
    return [
      /*  1 */ // reasonForCreationSection added when editing
      /*  2 */ NotesTemplate,
      /*  3 */ HgvTechRecord,
      /*  4 */ HgvAndTrlTypeApprovalTemplate,
      /*  5 */ ApplicantDetails,
      /*  6 */ DocumentsTemplate,
      /*  7 */ HgvAndTrlBodyTemplate,
      /*  8 */ HgvWeight,
      /*  9 */ tyresTemplateHgv,
      /* 10 */ HgvDimensionsTemplate,
      /* 11 */ PlatesTemplate
    ];
  }

  getTrlTemplates(): Array<FormNode> {
    return [
      /*  1 */ // reasonForCreationSection added when editing
      /*  2 */ NotesTemplate,
      /*  3 */ TrlTechRecordTemplate,
      /*  4 */ HgvAndTrlTypeApprovalTemplate,
      /*  5 */ ApplicantDetails,
      /*  6 */ DocumentsTemplate,
      /*  7 */ HgvAndTrlBodyTemplate,
      /*  8 */ TrlWeight,
      /*  9 */ tyresTemplateTrl,
      /* 10 */ TrlBrakesTemplate,
      /* 11 */ TrlPurchasers,
      /* 12 */ TrlDimensionsTemplate,
      /* 13 */ PlatesTemplate,
      /* 14 */ TrlAuthIntoServiceTemplate,
      /* 15 */ ManufacturerTemplate
    ];
  }
}
