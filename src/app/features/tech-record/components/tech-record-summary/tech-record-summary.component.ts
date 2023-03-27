import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
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
import { CustomFormArray, CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { EuVehicleCategories, TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { AxlesService } from '@services/axles/axles.service';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { editableTechRecord } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { cloneDeep, mergeWith } from 'lodash';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tech-record-summary[techRecord]',
  templateUrl: './tech-record-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tech-record-summary.component.scss']
})
export class TechRecordSummaryComponent implements OnInit, OnDestroy {
  @ViewChildren(DynamicFormGroupComponent) sections!: QueryList<DynamicFormGroupComponent>;
  @ViewChild(BodyComponent) body!: BodyComponent;
  @ViewChild(DimensionsComponent) dimensions!: DimensionsComponent;
  @ViewChild(PsvBrakesComponent) psvBrakes?: PsvBrakesComponent;
  @ViewChild(TrlBrakesComponent) trlBrakes?: TrlBrakesComponent;
  @ViewChild(TyresComponent) tyres!: TyresComponent;
  @ViewChild(WeightsComponent) weights!: WeightsComponent;
  @ViewChild(LettersComponent) letters!: LettersComponent;

  @Input() techRecord!: TechRecordModel;
  @Input() isEditing: boolean = false;

  @Output() isFormDirty = new EventEmitter<boolean>();
  @Output() isFormInvalid = new EventEmitter<boolean>();

  techRecordCalculated!: TechRecordModel;
  sectionTemplates: Array<FormNode> = [];
  middleIndex = 0;

  private isTechRecordCleaned = false;
  private destroy$ = new Subject<void>();

  constructor(
    private axlesService: AxlesService,
    private errorService: GlobalErrorService,
    private referenceDataService: ReferenceDataService,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {}

  ngOnInit(): void {
    this.store
      .pipe(
        select(editableTechRecord),
        //Need to check that the editing tech record has more than just reason for creation on and is the full object.
        map(techRecord => {
          if (
            techRecord &&
            (this.techRecord.vehicleType === VehicleTypes.HGV || this.techRecord.vehicleType === VehicleTypes.TRL) &&
            this.isEditing &&
            !this.isTechRecordCleaned
          ) {
            const [axles, axleSpacing] = this.axlesService.normaliseAxles(techRecord.axles, techRecord.dimensions?.axleSpacing);
            const cleanedTechRecord = cloneDeep(techRecord);
            cleanedTechRecord.dimensions = { ...techRecord.dimensions, axleSpacing };
            cleanedTechRecord.axles = axles;
            this.isTechRecordCleaned = true;
            return cleanedTechRecord;
          }

          if (techRecord && Object.keys(techRecord).length > 1) {
            return cloneDeep(techRecord);
          } else {
            this.technicalRecordService.updateEditingTechRecord(this.techRecord, true);
            return { ...cloneDeep(this.techRecord), reasonForCreation: '' };
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(techRecord => {
        this.techRecordCalculated = techRecord;
        this.referenceDataService.removeTyreSearch();
        this.sectionTemplates = this.vehicleTemplates;
        this.middleIndex = Math.floor(this.sectionTemplates.length / 2);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get vehicleTemplates(): Array<FormNode> {
    const type =
      this.techRecordCalculated.vehicleType === VehicleTypes.TRL && this.techRecordCalculated.euVehicleCategory === EuVehicleCategories.O1
        ? VehicleTypes.SMALL_TRL
        : this.techRecordCalculated.vehicleType;

    return vehicleTemplateMap.get(type)?.filter(template => template.name !== (this.isEditing ? 'audit' : 'reasonForCreationSection')) ?? [];
  }

  get customSectionForms(): Array<CustomFormGroup | CustomFormArray> {
    const commonCustomSections = [this.body?.form, this.dimensions?.form, this.tyres?.form, this.weights?.form];

    switch (this.techRecordCalculated.vehicleType) {
      case VehicleTypes.PSV:
        return [...commonCustomSections, this.psvBrakes!.form];
      case VehicleTypes.HGV:
        return commonCustomSections;
      case VehicleTypes.TRL:
        return this.techRecordCalculated.euVehicleCategory !== EuVehicleCategories.O1
          ? [...commonCustomSections, this.trlBrakes!.form, this.letters!.form]
          : [];
      default:
        return [];
    }
  }

  handleFormState(event: any): void {
    const isPrimitiveArray = (a: any, b: any) => (Array.isArray(a) && !a.some(i => typeof i === 'object') ? b : undefined);

    this.techRecordCalculated = mergeWith(cloneDeep(this.techRecordCalculated), event, isPrimitiveArray);

    this.technicalRecordService.updateEditingTechRecord(this.techRecordCalculated);
  }

  checkForms(): void {
    const forms = this.sections?.map(section => section.form).concat(this.customSectionForms);

    this.isFormDirty.emit(forms.some(form => form.dirty));

    this.setErrors(forms);

    this.isFormInvalid.emit(forms.some(form => form.invalid));
  }

  setErrors(forms: Array<CustomFormGroup | CustomFormArray>): void {
    const errors: GlobalError[] = [];

    forms.forEach(form => DynamicFormService.validate(form, errors));

    errors.length ? this.errorService.setErrors(errors) : this.errorService.clearErrors();
  }
}
