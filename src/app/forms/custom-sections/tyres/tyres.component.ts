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
  TechRecordModel,
  Tyres,
  Tyre,
  VehicleTypes,
  SpeedCategorySymbol,
  ReasonForEditing
} from '@models/vehicle-tech-record.model';
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

  @Output() formChange = new EventEmitter();

  public isError: boolean = false;
  public errorMessage?: string;
  public form!: CustomFormGroup;
  private editingReason?: ReasonForEditing;
  private _formSubscription = new Subscription();

  constructor(
    public dfs: DynamicFormService,
    private referenceDataService: ReferenceDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editingReason = this.route.snapshot.data['reason'];
  }

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.vehicleTechRecord) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe(event => this.formChange.emit(event));
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

  get template(): FormNode {
    switch (this.vehicleTechRecord.vehicleType) {
      case VehicleTypes.PSV:
        return PsvTyresTemplate;
      case VehicleTypes.HGV:
        return tyresTemplateHgv;
      case VehicleTypes.TRL:
        return tyresTemplateTrl;
      // TODO: Create light vehicle specific functions for this
      default:
        return PsvTyresTemplate;
    }
  }

  get isPsv(): boolean {
    return this.vehicleTechRecord.vehicleType === VehicleTypes.PSV;
  }

  get isTrl(): boolean {
    return this.vehicleTechRecord.vehicleType === VehicleTypes.TRL;
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

  searchTyres(name: any, axleNumber: number) {
    if (name === 'tyreCode') {
      this.getTyresRefData(this.vehicleTechRecord.axles[axleNumber - 1].tyres!, axleNumber);
    }
  }

  getTyresRefData(tyre: Tyres, axleNumber: number): void {
    this.isError = false;
    this.referenceDataService.fetchReferenceDataByKey(ReferenceDataResourceType.Tyres, String(tyre.tyreCode)).subscribe({
      next: data => {
        const refTyre = data as ReferenceDataTyre;
        const indexLoad = tyre.fitmentCode === FitmentCode.SINGLE ? Number(refTyre.loadIndexSingleLoad) : Number(refTyre.loadIndexTwinLoad);
        const newTyre = new Tyre({ ...tyre, tyreSize: refTyre.tyreSize, plyRating: refTyre.plyRating, dataTrAxles: indexLoad });

        this.addTyreToTechRecord(newTyre, axleNumber);
      },
      error: _e => {
        this.errorMessage = 'Cannot find data of this tyre on axle ' + axleNumber;
        this.isError = true;
        const newTyre = new Tyre({ ...tyre, tyreCode: null, tyreSize: null, plyRating: null, dataTrAxles: null });

        this.addTyreToTechRecord(newTyre, axleNumber);
      }
    });
  }

  getTyreSearchPage(axleNumber: number) {
    this.router.navigate([`../${this.editingReason}/tyre-search/${axleNumber}`], { relativeTo: this.route, state: this.vehicleTechRecord });
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

    if (this.vehicleTechRecord.axles.length < 10) {
      this.isError = false;
      this.axles.addControl(newAxle);
    } else {
      this.isError = true;
      this.errorMessage = `Cannot have more than ${10} axles`;
    }
  }

  removeAxle(index: number): void {
    const minLength = this.isTrl ? 1 : 2;

    if (this.vehicleTechRecord.axles.length > minLength) {
      this.isError = false;
      this.axles.removeAt(index);
    } else {
      this.isError = true;
      this.errorMessage = `Cannot have less than ${minLength} axles`;
    }
  }
}
