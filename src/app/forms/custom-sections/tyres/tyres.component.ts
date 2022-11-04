import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { tyresTemplateHgv } from '@forms/templates/hgv/hgv-tyres.template';
import { tyresTemplatePsv } from '@forms/templates/psv/psv-tyres.template';
import { tyresTemplateTrl } from '@forms/templates/trl/trl-tyres.template';
import { getOptionsFromEnum, getOptionsFromEnumOneChar } from '@forms/utils/enum-map';
import { ReferenceDataResourceType, ReferenceDataTyre } from '@models/reference-data.model';
import { Axle, FitmentCode, TechRecordModel, Tyres, Tyre, VehicleTypes, SpeedCategorySymbol } from '@models/vehicle-tech-record.model';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { cloneDeep } from 'lodash';
import { Subscription, debounceTime, take } from 'rxjs';

@Component({
  selector: 'app-tyres',
  templateUrl: './tyres.component.html',
  styleUrls: ['./tyres.component.scss']
})
export class TyresComponent implements OnInit, OnDestroy, OnChanges {
  @Input() vehicleTechRecord!: TechRecordModel;
  @Input() isEditing = false;
  public isError: boolean = false;
  public errorMessage?: string;

  @Output() formChange = new EventEmitter();

  public form!: CustomFormGroup;
  private _formSubscription = new Subscription();

  constructor(public dfs: DynamicFormService, private referenceDataService: ReferenceDataService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.vehicleTechRecord) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe(event => this.formChange.emit(event));
    this.referenceDataService.loadReferenceData(ReferenceDataResourceType.Tyres);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    const fitmentUpdated = this.checkFitmentCodeHasChanged(simpleChanges);

    if (!fitmentUpdated) {
      this.form?.patchValue(this.vehicleTechRecord, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get template() {
    switch (this.vehicleTechRecord.vehicleType) {
      case VehicleTypes.PSV:
        return tyresTemplatePsv;
      case VehicleTypes.HGV:
        return tyresTemplateHgv;
      case VehicleTypes.TRL:
        return tyresTemplateTrl;
    }
  }

  get isPsv(): boolean {
    return this.vehicleTechRecord.vehicleType === VehicleTypes.PSV;
  }

  get isHgvOrTrl(): boolean {
    return this.vehicleTechRecord.vehicleType === VehicleTypes.HGV || this.vehicleTechRecord.vehicleType === VehicleTypes.TRL;
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
    return this.form.get(['axles']) as CustomFormArray;
  }

  getAxleTyres(i: number): CustomFormGroup {
    return this.axles.get([i, 'tyres']) as CustomFormGroup;
  }

  checkFitmentCodeHasChanged(simpleChanges: SimpleChanges): boolean {
    const { vehicleTechRecord } = simpleChanges;

    if (vehicleTechRecord.firstChange !== undefined && vehicleTechRecord.firstChange === false) {
      const currentAxles = vehicleTechRecord.currentValue.axles;
      const previousAxles = vehicleTechRecord.previousValue.axles;

      for (let [index, axle] of currentAxles.entries()) {
        if (
          axle.tyres !== undefined &&
          previousAxles[index] &&
          previousAxles[index].tyres !== undefined &&
          axle.tyres.fitmentCode !== previousAxles[index].tyres.fitmentCode
        ) {
          this.getTyresRefData(axle.tyres, axle.axleNumber);
          return true;
        }
      }
    }

    return false;
  }

  getTyresRefData(tyre: Tyres, axleNumber: number) {
    this.isError = false;
    this.referenceDataService
      .getByKey$(ReferenceDataResourceType.Tyres, String(tyre.tyreCode))
      .pipe(take(1))
      .subscribe({
        next: data => {
          try {
            const refTyre = data as ReferenceDataTyre;
            const indexLoad = tyre.fitmentCode === FitmentCode.SINGLE ? Number(refTyre.loadIndexSingleLoad) : Number(refTyre.loadIndexTwinLoad);
            const newTyre = new Tyre({ ...tyre, tyreSize: refTyre.tyreSize, plyRating: refTyre.plyRating, dataTrAxles: indexLoad });

            this.addTyreToTechRecord(newTyre, axleNumber);
          } catch {
            this.errorMessage = 'Cannot find data of this tyre';
            this.isError = true;
            const newTyre = new Tyre({ ...tyre, tyreSize: null, plyRating: null, dataTrAxles: null });

            this.addTyreToTechRecord(newTyre, axleNumber);
          }
        }
      });
  }

  addTyreToTechRecord(tyre: Tyres, axleNumber: number): void {
    this.vehicleTechRecord = cloneDeep(this.vehicleTechRecord);
    this.vehicleTechRecord.axles.find(ax => ax.axleNumber === axleNumber)!.tyres = tyre;
    this.form.patchValue(this.vehicleTechRecord);
  }

  addAxle(): void {
    const tyres: Tyres = {
      tyreSize: null,
      speedCategorySymbol: null,
      fitmentCode: null,
      dataTrAxles: null,
      plyRating: null,
      tyreCode: null
    };

    const newAxle: Axle = {
      axleNumber: this.axles.length + 1,
      tyres: tyres
    };

    if (this.vehicleTechRecord.axles.length < 5) {
      this.isError = false;
      this.axles.addControl(newAxle);
    } else {
      this.isError = true;
      this.errorMessage = 'Cannot have more than 5 axles';
    }
  }

  removeAxle(index: number): void {
    if (this.vehicleTechRecord.axles.length > 2) {
      this.isError = false;
      this.axles.removeAt(index);
    } else {
      this.isError = true;
      this.errorMessage = 'Cannot have less than 2 axles';
    }
  }
}
