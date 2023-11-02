import { ViewportScroller } from '@angular/common';
import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import {
  CustomFormArray, CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeWidth,
} from '@forms/services/dynamic-form.types';
import { tyresTemplateHgv } from '@forms/templates/hgv/hgv-tyres.template';
import { PsvTyresTemplate } from '@forms/templates/psv/psv-tyres.template';
import { tyresTemplateTrl } from '@forms/templates/trl/trl-tyres.template';
import { getOptionsFromEnum, getOptionsFromEnumOneChar } from '@forms/utils/enum-map';
import { ReferenceDataResourceType, ReferenceDataTyre } from '@models/reference-data.model';
import {
  Axle, FitmentCode, ReasonForEditing, SpeedCategorySymbol, Tyre, Tyres, VehicleTypes,
} from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { addAxle, removeAxle, updateScrollPosition } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
// eslint-disable-next-line import/no-extraneous-dependencies
import { cloneDeep } from 'lodash';
import { Subscription } from 'rxjs';
import { TyreUseCode as HgvTyreUseCode } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tyreUseCodeHgv.enum.js';
import { TyreUseCode as TrlTyreUseCode } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tyreUseCodeTrl.enum.js';

@Component({
  selector: 'app-tyres',
  templateUrl: './tyres.component.html',
  styleUrls: ['./tyres.component.scss'],
})
export class TyresComponent implements OnInit, OnDestroy, OnChanges {
  @Input() vehicleTechRecord!: TechRecordType<'psv'> | TechRecordType<'trl'> | TechRecordType<'hgv'>;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  public isError = false;
  public errorMessage?: string;
  public form!: CustomFormGroup;
  private editingReason?: ReasonForEditing;
  private formSubscription = new Subscription();

  constructor(
    private dynamicFormsService: DynamicFormService,
    private referenceDataService: ReferenceDataService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private viewportScroller: ViewportScroller,
  ) {
    this.editingReason = this.route.snapshot.data['reason'];
  }

  ngOnInit(): void {
    this.form = this.dynamicFormsService.createForm(this.template!, this.vehicleTechRecord) as CustomFormGroup;
    this.formSubscription = this.form.cleanValueChanges.subscribe((event: any) => {
      if (event?.axles) {
        event.axles = (event.axles as Axle[]).filter((axle) => !!axle?.axleNumber);
      }
      if (event.techRecord_tyreUseCode === ' ') {
        event = { ...event, techRecord_tyreUseCode: null };
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
    this.formSubscription.unsubscribe();
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
        return undefined;
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

  get requiredPlates(): boolean {
    return this.vehicleTechRecord.techRecord_vehicleType !== VehicleTypes.PSV && this.isEditing === true;
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

      // eslint-disable-next-line no-restricted-syntax
      for (const [index, axle] of currentAxles.entries()) {
        if (
          axle?.tyres_fitmentCode !== undefined
          && previousAxles[`${index}`]
          && previousAxles[`${index}`].tyres_fitmentCode !== undefined
          && axle.tyres_fitmentCode !== previousAxles[`${index}`].tyres_fitmentCode
          && axle.tyres_tyreCode === previousAxles[`${index}`].tyres_tyreCode
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
        .fetchReferenceDataByKey(ReferenceDataResourceType.Tyres, String(this.vehicleTechRecord.techRecord_axles![axleNumber - 1]?.tyres_tyreCode))
        .subscribe({
          next: (data) => {
            const refTyre = data as ReferenceDataTyre;
            const indexLoad = this.vehicleTechRecord.techRecord_axles![axleNumber - 1]?.tyres_fitmentCode === FitmentCode.SINGLE
              ? Number(refTyre.loadIndexSingleLoad)
              : Number(refTyre.loadIndexTwinLoad);
            const newTyre = new Tyre({
              tyreCode: this.vehicleTechRecord.techRecord_axles![axleNumber - 1]?.tyres_tyreCode,
              tyreSize: refTyre.tyreSize,
              plyRating: refTyre.plyRating,
              dataTrAxles: indexLoad,
            });

            this.addTyreToTechRecord(newTyre, axleNumber);
          },
          error: () => {
            this.errorMessage = `Cannot find data of this tyre on axle ${axleNumber}`;
            this.isError = true;
            const newTyre = new Tyre({
              tyreCode: null,
              tyreSize: null,
              plyRating: null,
              dataTrAxles: null,
            });

            this.addTyreToTechRecord(newTyre, axleNumber);
          },
        });
    }
  }

  getTyreSearchPage(axleNumber: number) {
    const route = this.editingReason ? `../${this.editingReason}/tyre-search/${axleNumber}` : `./tyre-search/${axleNumber}`;

    this.store.dispatch(updateScrollPosition({ position: this.viewportScroller.getScrollPosition() }));

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.router.navigate([route], { relativeTo: this.route, state: this.vehicleTechRecord });
  }

  addTyreToTechRecord(tyre: Tyres, axleNumber: number): void {
    this.vehicleTechRecord = cloneDeep(this.vehicleTechRecord);
    const axleIndex = this.vehicleTechRecord.techRecord_axles?.findIndex((ax: any) => ax.axleNumber === axleNumber);

    if (axleIndex === undefined || axleIndex === -1) {
      return;
    }
    const axle = this.vehicleTechRecord.techRecord_axles?.[`${axleIndex}`];
    if (axle) {
      axle.tyres_tyreCode = tyre.tyreCode;
      axle.tyres_tyreSize = tyre.tyreSize;
      axle.tyres_plyRating = tyre.plyRating;
      axle.tyres_dataTrAxles = tyre.dataTrAxles;
      this.form.patchValue(this.vehicleTechRecord);
    }
  }

  addAxle(): void {
    if (!this.vehicleTechRecord.techRecord_axles || this.vehicleTechRecord.techRecord_axles.length < 10) {
      this.isError = false;
      this.store.dispatch(addAxle());
    } else {
      this.isError = true;
      this.errorMessage = `Cannot have more than ${10} axles`;
    }
  }

  removeAxle(index: number): void {
    const minLength = this.isTrl ? 1 : 2;
    const axles = this.vehicleTechRecord.techRecord_axles;

    if (axles && axles.length > minLength) {
      this.isError = false;
      this.store.dispatch(removeAxle({ index }));
    } else {
      this.isError = true;
      this.errorMessage = `Cannot have less than ${minLength} axles`;
    }
  }

  protected readonly getOptionsFromEnum = getOptionsFromEnum;

  get tyreUseCode() {
    const useCodeEnum = this.vehicleTechRecord.techRecord_vehicleType === 'hgv' ? HgvTyreUseCode : TrlTyreUseCode;
    return getOptionsFromEnum({ ' ': ' ', ...useCodeEnum });
  }
}
