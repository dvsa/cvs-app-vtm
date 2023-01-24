import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { BodyComponent } from '@forms/custom-sections/body/body.component';
import { DimensionsComponent } from '@forms/custom-sections/dimensions/dimensions.component';
import { PsvBrakesComponent } from '@forms/custom-sections/psv-brakes/psv-brakes.component';
import { TrlBrakesComponent } from '@forms/custom-sections/trl-brakes/trl-brakes.component';
import { TyresComponent } from '@forms/custom-sections/tyres/tyres.component';
import { WeightsComponent } from '@forms/custom-sections/weights/weights.component';
import { FormNode } from '@forms/services/dynamic-form.types';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { BodyTypeCode, vehicleBodyTypeCodeMap } from '@models/body-type-enum';
import { PsvMake, ReferenceDataResourceType } from '@models/reference-data.model';
import { Axle, AxleSpacing, TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { ReferenceDataState, selectReferenceDataByResourceKey } from '@store/reference-data';
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';
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

  @Input() vehicleTechRecord!: TechRecordModel;
  @Input() refDataState!: ReferenceDataState;
  @Input()
  set isEditing(value: boolean) {
    this._isEditing = value;
    this.calculateVehicleModel();
  }
  @Output() formChange = new EventEmitter();

  private _isEditing: boolean = false;
  vehicleTechRecordCalculated!: TechRecordModel;
  sectionTemplates: Array<FormNode> = [];
  middleIndex = 0;

  constructor(
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
      selectReferenceDataByResourceKey(ReferenceDataResourceType.PsvMake, this.vehicleTechRecordCalculated.brakes?.dtpNumber as string)
    ) as Observable<PsvMake>;
  }

  get vehicleTemplates(): Array<FormNode> {
    const vehicleTemplates = vehicleTemplateMap.get(this.vehicleTechRecordCalculated.vehicleType);
    if (vehicleTemplates) return this.isEditing ? vehicleTemplates : vehicleTemplates.filter(t => t.name !== 'reasonForCreationSection');
    else return [] as Array<FormNode>;
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
      : (this.vehicleTechRecordCalculated = { ...this.vehicleTechRecord });

    this.technicalRecordService.updateEditingTechRecord(this.vehicleTechRecordCalculated, true);
  }

  handleFormState(event: any): void {
    this.vehicleTechRecordCalculated = cloneDeep(this.vehicleTechRecordCalculated);

    if (event.axles && event.axles.length < this.vehicleTechRecordCalculated.axles!.length) {
      this.removeAxle(event);
    } else if (event.axles && this.vehicleTechRecordCalculated.axles!.length < event.axles.length) {
      this.addAxle(event);
    } else {
      this.vehicleTechRecordCalculated = merge(this.vehicleTechRecordCalculated, event);
    }

    if (event.brakes?.dtpNumber && (event.brakes.dtpNumber.length === 4 || event.brakes.dtpNumber.length === 6)) {
      this.setBodyFields(this.vehicleTechRecordCalculated.vehicleType);
    }

    if (this.vehicleTechRecordCalculated.vehicleType === VehicleTypes.PSV && (event.grossKerbWeight || event.grossLadenWeight || event.brakes)) {
      this.setBrakesForces();
    }

    if (
      this.vehicleTechRecord.vehicleType === VehicleTypes.PSV ||
      this.vehicleTechRecord.vehicleType === VehicleTypes.HGV ||
      this.vehicleTechRecord.vehicleType === VehicleTypes.TRL
    ) {
      this.vehicleTechRecordCalculated.noOfAxles = this.vehicleTechRecordCalculated.axles?.length ?? 0;
    }

    this.technicalRecordService.updateEditingTechRecord(this.vehicleTechRecordCalculated);
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
        this.vehicleTechRecordCalculated.axles!.length,
        true,
        this.vehicleTechRecordCalculated.dimensions.axleSpacing
      );
    }
  }

  removeAxle(axleEvent: any): void {
    const axleToRemove = this.findAxleToRemove(axleEvent.axles);

    this.vehicleTechRecordCalculated.axles = this.vehicleTechRecordCalculated.axles!.filter(ax => {
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
        ? { kerbWeight: null, ladenWeight: null, gbWeight: null, designWeight: null }
        : { gbWeight: null, eecWeight: null, designWeight: null };

    const tyres = { tyreSize: null, speedCategorySymbol: null, fitmentCode: null, dataTrAxles: null, plyRating: null, tyreCode: null };

    return { axleNumber, weights, tyres };
  }

  setBodyFields(vehicleType: VehicleTypes): void {
    this.psvFromDtp$.pipe(take(1)).subscribe(payload => {
      const code = payload?.psvBodyType.toLowerCase() as BodyTypeCode;

      this.vehicleTechRecordCalculated.bodyType = { code, description: vehicleBodyTypeCodeMap.get(vehicleType)?.get(code) };
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
      brakeCode: this.brakeCodePrefix + this.vehicleTechRecordCalculated.brakes?.brakeCodeOriginal,
      brakeForceWheelsNotLocked: {
        serviceBrakeForceA: Math.round(((this.vehicleTechRecordCalculated.grossLadenWeight || 0) * 16) / 100),
        secondaryBrakeForceA: Math.round(((this.vehicleTechRecordCalculated.grossLadenWeight || 0) * 22.5) / 100),
        parkingBrakeForceA: Math.round(((this.vehicleTechRecordCalculated.grossLadenWeight || 0) * 45) / 100)
      },
      brakeForceWheelsUpToHalfLocked: {
        serviceBrakeForceB: Math.round(((this.vehicleTechRecordCalculated.grossKerbWeight || 0) * 16) / 100),
        secondaryBrakeForceB: Math.round(((this.vehicleTechRecordCalculated.grossKerbWeight || 0) * 25) / 100),
        parkingBrakeForceB: Math.round(((this.vehicleTechRecordCalculated.grossKerbWeight || 0) * 50) / 100)
      }
    };
  }
}
