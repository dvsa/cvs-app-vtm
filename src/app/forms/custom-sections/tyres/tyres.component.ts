import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { tyresTemplateHgv } from '@forms/templates/hgv/hgv-tyres.template';
import { PsvTyresTemplate } from '@forms/templates/psv/psv-tyres.template';
import { tyresTemplateTrl } from '@forms/templates/trl/trl-tyres.template';
import { getOptionsFromEnum, getOptionsFromEnumOneChar } from '@forms/utils/enum-map';
import { ReferenceDataResourceType, ReferenceDataTyre } from '@models/reference-data.model';
import {
  Axle,
  FitmentCode,
  ReasonForEditing,
  SpeedCategorySymbol,
  Tyre,
  Tyres,
  V3TechRecordModel,
  VehicleTypes
} from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { addAxle, removeAxle } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { cloneDeep } from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tyres',
  templateUrl: './tyres.component.html',
  styleUrls: ['./tyres.component.scss']
})
export class TyresComponent implements OnInit, OnDestroy, OnChanges {
  @Input() vehicleTechRecord!: V3TechRecordModel;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  public isError: boolean = false;
  public errorMessage?: string;
  public form!: CustomFormGroup;
  private editingReason?: ReasonForEditing;
  private _formSubscription = new Subscription();

  constructor(
    private dynamicFormsService: DynamicFormService,
    private referenceDataService: ReferenceDataService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>
  ) {
    this.editingReason = this.route.snapshot.data['reason'];
  }

  ngOnInit(): void {
    this.form = this.dynamicFormsService.createForm(this.template!, this.vehicleTechRecord) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.subscribe((event: any) => {
      if (event?.axles) {
        event.axles = (event.axles as Axle[]).filter(axle => !!axle?.axleNumber);
      }

      this.formChange.emit(event);
    });
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    const fitmentUpdated = this.checkFitmentCodeHasChanged(simpleChanges);

    if (!fitmentUpdated) {
      this.form?.patchValue(this.vehicleTechRecord, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get template(): FormNode | undefined {
    switch (this.vehicleTechRecord.techRecord_vehicleType) {
      case VehicleTypes.PSV:
        return PsvTyresTemplate;
      case VehicleTypes.HGV:
        return tyresTemplateHgv;
      case VehicleTypes.TRL:
        return tyresTemplateTrl;
      default:
        return;
    }
  }

  get isPsv(): boolean {
    return this.vehicleTechRecord.techRecord_vehicleType === VehicleTypes.PSV;
  }

  get isTrl(): boolean {
    return this.vehicleTechRecord.techRecord_vehicleType === VehicleTypes.TRL;
  }

  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  get speedCategorySymbol(): MultiOptions {
    return getOptionsFromEnum(SpeedCategorySymbol);
  }

  get fitmentCode(): MultiOptions {
    return getOptionsFromEnumOneChar(FitmentCode);
  }

  get axles(): CustomFormArray {
    return this.form.get(['techRecord_axles']) as CustomFormArray;
  }

  getAxleTyres(i: number): CustomFormGroup {
    return this.axles.get([i]) as CustomFormGroup;
  }

  checkFitmentCodeHasChanged(simpleChanges: SimpleChanges): boolean {
    const { vehicleTechRecord } = simpleChanges;

    if (vehicleTechRecord.firstChange !== undefined && vehicleTechRecord.firstChange === false) {
      const currentAxles = vehicleTechRecord.currentValue.techRecord_axles;
      const previousAxles = vehicleTechRecord.previousValue.techRecord_axles;

      if (!previousAxles) return false;

      for (let [index, axle] of currentAxles.entries()) {
        if (
          axle?.tyres_fitmentCode !== undefined &&
          previousAxles[index] &&
          previousAxles[index].tyres_fitmentCode !== undefined &&
          axle.tyres_fitmentCode !== previousAxles[index].tyres_fitmentCode &&
          axle.tyres_tyreCode === previousAxles[index].tyres_tyreCode
        ) {
          this.getTyresRefData('tyres_tyreCode', axle.axleNumber);
          return true;
        }
      }
    }

    return false;
  }

  getTyresRefData(name: string, axleNumber: number): void {
    if (name === 'tyres_tyreCode') {
      this.isError = false;
      this.referenceDataService
        .fetchReferenceDataByKey(
          ReferenceDataResourceType.Tyres,
          String((this.vehicleTechRecord as any).techRecord_axles![axleNumber - 1].tyres_tyreCode)
        )
        .subscribe({
          next: data => {
            const refTyre = data as ReferenceDataTyre;
            const indexLoad =
              (this.vehicleTechRecord as any).techRecord_axles![axleNumber - 1].tyres_fitmentCode === FitmentCode.SINGLE
                ? Number(refTyre.loadIndexSingleLoad)
                : Number(refTyre.loadIndexTwinLoad);
            const newTyre = new Tyre({
              tyreCode: (this.vehicleTechRecord as any).techRecord_axles![axleNumber - 1].tyres_tyreCode,
              tyreSize: refTyre.tyreSize,
              plyRating: refTyre.plyRating,
              dataTrAxles: indexLoad
            });

            this.addTyreToTechRecord(newTyre, axleNumber);
          },
          error: _e => {
            this.errorMessage = 'Cannot find data of this tyre on axle ' + axleNumber;
            this.isError = true;
            const newTyre = new Tyre({ tyreCode: null, tyreSize: null, plyRating: null, dataTrAxles: null });

            this.addTyreToTechRecord(newTyre, axleNumber);
          }
        });
    }
  }

  getTyreSearchPage(axleNumber: number) {
    const route = this.editingReason ? `../${this.editingReason}/tyre-search/${axleNumber}` : `./tyre-search/${axleNumber}`;

    this.router.navigate([route], { relativeTo: this.route, state: this.vehicleTechRecord });
  }

  addTyreToTechRecord(tyre: Tyres, axleNumber: number): void {
    this.vehicleTechRecord = cloneDeep(this.vehicleTechRecord);
    //TODO V3 Remove as any HGV
    const axle = (this.vehicleTechRecord as any).techRecord_axles!.find((ax: any) => ax.axleNumber === axleNumber)!;
    axle.tyres_tyreCode = tyre.tyreCode;
    axle.tyres_tyreSize = tyre.tyreSize;
    axle.tyres_plyRating = tyre.plyRating;
    axle.tyres_dataTrAxles = tyre.dataTrAxles;
    this.form.patchValue(this.vehicleTechRecord);
  }

  addAxle(): void {
    //TODO V3 Remove as any HGV
    if (!(this.vehicleTechRecord as any).techRecord_axles || (this.vehicleTechRecord as any).techRecord_axles!.length < 10) {
      this.isError = false;
      this.store.dispatch(addAxle());
    } else {
      this.isError = true;
      this.errorMessage = `Cannot have more than ${10} axles`;
    }
  }

  removeAxle(index: number): void {
    const minLength = this.isTrl ? 1 : 2;
    //TODO V3 Remove as any HGV
    if ((this.vehicleTechRecord as any).techRecord_axles!.length > minLength) {
      this.isError = false;
      this.store.dispatch(removeAxle({ index }));
    } else {
      this.isError = true;
      this.errorMessage = `Cannot have less than ${minLength} axles`;
    }
  }
}
