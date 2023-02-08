import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { BodyComponent } from '@forms/custom-sections/body/body.component';
import { DimensionsComponent } from '@forms/custom-sections/dimensions/dimensions.component';
import { LettersComponent } from '@forms/custom-sections/letters/letters.component';
import { PsvBrakesComponent } from '@forms/custom-sections/psv-brakes/psv-brakes.component';
import { TrlBrakesComponent } from '@forms/custom-sections/trl-brakes/trl-brakes.component';
import { TyresComponent } from '@forms/custom-sections/tyres/tyres.component';
import { WeightsComponent } from '@forms/custom-sections/weights/weights.component';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { FormNode, CustomFormArray, CustomFormGroup } from '@forms/services/dynamic-form.types';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { BodyTypeCode, vehicleBodyTypeCodeMap } from '@models/body-type-enum';
import { PsvMake, ReferenceDataResourceType } from '@models/reference-data.model';
import { Axle, AxleSpacing, TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { ReferenceDataState, selectReferenceDataByResourceKey } from '@store/reference-data';
import { cloneDeep, merge } from 'lodash';
import { map, Observable, take } from 'rxjs';

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
  @ViewChild(LettersComponent) letters!: LettersComponent;

  @Input() techRecord!: TechRecordModel;
  @Input() refDataState!: ReferenceDataState;

  private _isEditing: boolean = false;
  @Input() set isEditing(value: boolean) {
    this._isEditing = value;
    this.calculateVehicleModel();
  }

  @Output() isFormDirty = new EventEmitter<boolean>();
  @Output() isFormInvalid = new EventEmitter<boolean>();

  techRecordCalculated!: TechRecordModel;
  sectionTemplates: Array<FormNode> = [];
  middleIndex = 0;

  constructor(
    private errorService: GlobalErrorService,
    private technicalRecordService: TechnicalRecordService,
    private store: Store<State>,
    private referenceDataService: ReferenceDataService
  ) {}

  ngOnInit(): void {
    this.referenceDataService.removeTyreSearch();
    this.calculateVehicleModel();
    this.sectionTemplates = this.vehicleTemplates;
    this.middleIndex = Math.floor(this.sectionTemplates.length / 2);
  }

  get isEditing(): boolean {
    return this._isEditing;
  }

  get psvFromDtp$(): Observable<PsvMake> {
    return this.store.select(
      selectReferenceDataByResourceKey(ReferenceDataResourceType.PsvMake, this.techRecordCalculated.brakes?.dtpNumber as string)
    ) as Observable<PsvMake>;
  }

  get vehicleTemplates(): Array<FormNode> {
    const vehicleTemplates = vehicleTemplateMap.get(this.techRecordCalculated.vehicleType);

    return vehicleTemplates
      ? this.isEditing
        ? vehicleTemplates
        : vehicleTemplates.filter(t => t.name !== 'reasonForCreationSection')
      : ([] as Array<FormNode>);
  }

  get customSectionForms(): Array<CustomFormGroup | CustomFormArray> {
    const commonCustomSections = [this.body.form, this.dimensions.form, this.tyres.form, this.weights.form];

    switch (this.techRecord.vehicleType) {
      case VehicleTypes.PSV:
        return [...commonCustomSections, this.psvBrakes!.form];
      case VehicleTypes.HGV:
        return commonCustomSections;
      case VehicleTypes.TRL:
        return [...commonCustomSections, this.trlBrakes!.form, this.letters!.form];
      default:
        return [];
    }
  }

  get brakeCodePrefix(): string {
    const prefix = `${Math.round(this.techRecordCalculated!.grossLadenWeight! / 100)}`;

    return prefix.length <= 2 ? '0' + prefix : prefix;
  }

  calculateVehicleModel(): void {
    this.isEditing
      ? this.technicalRecordService.editableTechRecord$
          .pipe(
            //Need to check that the editing tech record has more than just reason for creation on and is the full object.
            map(data => (data && Object.keys(data).length > 1 ? cloneDeep(data) : { ...cloneDeep(this.techRecord), reasonForCreation: '' })),
            take(1)
          )
          .subscribe(data => {
            this.techRecordCalculated = data;
            this.normaliseVehicleTechRecordAxles();
          })
      : (this.techRecordCalculated = { ...this.techRecord });

    this.technicalRecordService.updateEditingTechRecord(this.techRecordCalculated, true);
  }

  handleFormState(event: any): void {
    this.techRecordCalculated = cloneDeep(this.techRecordCalculated);

    if (event.axles && event.axles.length < this.techRecordCalculated.axles!.length) {
      this.removeAxle(event);
    } else if (event.axles && this.techRecordCalculated.axles!.length < event.axles.length) {
      this.addAxle(event);
    } else {
      this.techRecordCalculated = merge(this.techRecordCalculated, event);
    }

    if (event.brakes?.dtpNumber && event.brakes.dtpNumber.length >= 4 && this.techRecordCalculated.vehicleType === VehicleTypes.PSV) {
      this.setBodyFields(this.techRecordCalculated.vehicleType);
    }

    if (this.techRecordCalculated.vehicleType === VehicleTypes.PSV && (event.grossKerbWeight || event.grossLadenWeight || event.brakes)) {
      this.setBrakesForces();
    }

    if (
      this.techRecord.vehicleType === VehicleTypes.PSV ||
      this.techRecord.vehicleType === VehicleTypes.HGV ||
      this.techRecord.vehicleType === VehicleTypes.TRL
    ) {
      this.techRecordCalculated.noOfAxles = this.techRecordCalculated.axles?.length ?? 0;
    }

    this.technicalRecordService.updateEditingTechRecord(this.techRecordCalculated);

    this.checkForms();
  }

  checkForms(): void {
    const forms = this.sections?.map(section => section.form).concat(this.customSectionForms);

    this.isFormDirty.emit(forms.some(form => form.dirty));

    this.setErrors(forms);

    this.isFormInvalid.emit(forms.some(form => form.invalid));
  }

  setErrors(forms: Array<CustomFormGroup | CustomFormArray>): void {
    const errors: GlobalError[] = [];

    forms.forEach(form => DynamicFormService.updateValidity(form, errors));

    errors.length ? this.errorService.setErrors(errors) : this.errorService.clearErrors();
  }

  setBodyFields(vehicleType: VehicleTypes): void {
    this.psvFromDtp$.pipe(take(1)).subscribe(payload => {
      const code = payload?.psvBodyType.toLowerCase() as BodyTypeCode;

      this.techRecordCalculated.bodyType = { code, description: vehicleBodyTypeCodeMap.get(vehicleType)?.get(code) };
      this.techRecordCalculated.bodyMake = payload?.psvBodyMake;
      this.techRecordCalculated.chassisMake = payload?.psvChassisMake;
      this.techRecordCalculated.chassisModel = payload?.psvChassisModel;
    });
  }

  setBrakesForces(): void {
    this.techRecordCalculated.brakes = {
      ...this.techRecordCalculated.brakes,
      brakeCode: this.brakeCodePrefix + this.techRecordCalculated.brakes?.brakeCodeOriginal,
      brakeForceWheelsNotLocked: {
        serviceBrakeForceA: Math.round(((this.techRecordCalculated.grossLadenWeight || 0) * 16) / 100),
        secondaryBrakeForceA: Math.round(((this.techRecordCalculated.grossLadenWeight || 0) * 22.5) / 100),
        parkingBrakeForceA: Math.round(((this.techRecordCalculated.grossLadenWeight || 0) * 45) / 100)
      },
      brakeForceWheelsUpToHalfLocked: {
        serviceBrakeForceB: Math.round(((this.techRecordCalculated.grossKerbWeight || 0) * 16) / 100),
        secondaryBrakeForceB: Math.round(((this.techRecordCalculated.grossKerbWeight || 0) * 25) / 100),
        parkingBrakeForceB: Math.round(((this.techRecordCalculated.grossKerbWeight || 0) * 50) / 100)
      }
    };
  }

  addAxle(event: any): void {
    this.techRecordCalculated = merge(this.techRecordCalculated, event);
    if (this.techRecord.vehicleType !== VehicleTypes.PSV && this.techRecordCalculated.dimensions) {
      this.techRecordCalculated.dimensions.axleSpacing = this.generateAxleSpacing(
        this.techRecordCalculated.axles!.length,
        true,
        this.techRecordCalculated.dimensions.axleSpacing
      );
    }
  }

  removeAxle(axleEvent: any): void {
    const axleToRemove = this.findAxleToRemove(axleEvent.axles);

    this.techRecordCalculated.axles = this.techRecordCalculated.axles!.filter(ax => {
      if (ax.axleNumber !== axleToRemove) {
        if (ax.axleNumber! > axleToRemove) {
          ax.axleNumber! -= 1;
        }
        return true;
      }
      return false;
    });

    if (this.techRecord.vehicleType !== VehicleTypes.PSV && this.techRecordCalculated.dimensions) {
      this.techRecordCalculated.dimensions.axleSpacing = this.generateAxleSpacing(this.techRecordCalculated.axles.length);
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
    if (this.techRecordCalculated.vehicleType !== VehicleTypes.PSV) {
      const vehicleAxles = this.techRecordCalculated.axles;
      const vehicleAxleSpacings = this.techRecordCalculated.dimensions?.axleSpacing;

      //axles = axlespacings + 1
      if (vehicleAxles && vehicleAxleSpacings) {
        if (vehicleAxles.length > vehicleAxleSpacings.length + 1) {
          this.techRecordCalculated.dimensions!.axleSpacing = this.generateAxleSpacing(vehicleAxles.length, true, vehicleAxleSpacings);
        } else if (vehicleAxles.length < vehicleAxleSpacings.length + 1 && vehicleAxleSpacings.length) {
          this.techRecordCalculated.axles = this.generateAxlesFromAxleSpacings(
            this.techRecordCalculated.vehicleType,
            vehicleAxleSpacings.length,
            vehicleAxles
          );
        }
      } else if (vehicleAxles && !vehicleAxleSpacings) {
        this.techRecordCalculated.dimensions!.axleSpacing = this.generateAxleSpacing(vehicleAxles.length);
      } else if (!vehicleAxles && vehicleAxleSpacings && vehicleAxleSpacings.length) {
        this.techRecordCalculated.axles = this.generateAxlesFromAxleSpacings(this.techRecordCalculated.vehicleType, vehicleAxleSpacings.length);
      }
    }
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
        ? { kerbWeight: null, ladenWeight: null, gbWeight: null, designWeight: null }
        : { gbWeight: null, eecWeight: null, designWeight: null };

    const tyres = { tyreSize: null, speedCategorySymbol: null, fitmentCode: null, dataTrAxles: null, plyRating: null, tyreCode: null };

    return { axleNumber, weights, tyres };
  }
}
