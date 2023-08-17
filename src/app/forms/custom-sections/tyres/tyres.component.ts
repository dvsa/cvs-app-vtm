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
  FitmentCode,
  ReasonForEditing,
  SpeedCategorySymbol,
  Tyres,
  Tyre,
  VehicleTypes,
  Axle
} from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { addAxle, removeAxle } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { cloneDeep } from 'lodash';
import { Subscription } from 'rxjs';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';

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

      if (!previousAxles) return false;

      for (let [index, axle] of currentAxles.entries()) {
        if (
          axle?.tyres !== undefined &&
          previousAxles[index] &&
          previousAxles[index].tyres !== undefined &&
          axle.tyres.fitmentCode !== previousAxles[index].tyres.fitmentCode &&
          axle.tyres.tyreCode === previousAxles[index].tyres.tyreCode
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
      //TODO V3 remove as any HGV
      this.getTyresRefData((this.vehicleTechRecord as any).axles![axleNumber - 1].tyres!, axleNumber);
    }
  }

  getTyresRefData(tyres: Tyres, axleNumber: number): void {
    this.isError = false;
    this.referenceDataService.fetchReferenceDataByKey(ReferenceDataResourceType.Tyres, String(tyres.tyreCode)).subscribe({
      next: data => {
        const refTyre = data as ReferenceDataTyre;
        const indexLoad = tyres.fitmentCode === FitmentCode.SINGLE ? Number(refTyre.loadIndexSingleLoad) : Number(refTyre.loadIndexTwinLoad);
        const newTyre = new Tyre({ ...tyres, tyreSize: refTyre.tyreSize, plyRating: refTyre.plyRating, dataTrAxles: indexLoad });

        this.addTyreToTechRecord(newTyre, axleNumber);
      },
      error: _e => {
        this.errorMessage = 'Cannot find data of this tyre on axle ' + axleNumber;
        this.isError = true;
        const newTyre = new Tyre({ ...tyres, tyreCode: null, tyreSize: null, plyRating: null, dataTrAxles: null });

        this.addTyreToTechRecord(newTyre, axleNumber);
      }
    });
  }

  getTyreSearchPage(axleNumber: number) {
    const route = this.editingReason ? `../${this.editingReason}/tyre-search/${axleNumber}` : `./tyre-search/${axleNumber}`;

    this.router.navigate([route], { relativeTo: this.route, state: this.vehicleTechRecord });
  }

  addTyreToTechRecord(tyre: Tyres, axleNumber: number): void {
    this.vehicleTechRecord = cloneDeep(this.vehicleTechRecord);
    //TODO V3 Remove as any HGV
    (this.vehicleTechRecord as any).axles!.find((ax: any) => ax.axleNumber === axleNumber)!.tyres = tyre;
    this.form.patchValue(this.vehicleTechRecord);
  }

  addAxle(): void {
    //TODO V3 Remove as any HGV
    if (!(this.vehicleTechRecord as any).axles || (this.vehicleTechRecord as any).axles!.length < 10) {
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
    if ((this.vehicleTechRecord as any).axles!.length > minLength) {
      this.isError = false;
      this.store.dispatch(removeAxle({ index }));
    } else {
      this.isError = true;
      this.errorMessage = `Cannot have less than ${minLength} axles`;
    }
  }
}
