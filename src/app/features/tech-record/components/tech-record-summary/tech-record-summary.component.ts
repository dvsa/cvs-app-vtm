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
import { PsvBrakesComponent } from '@forms/custom-sections/psv-brakes/psv-brakes.component';
import { TrlBrakesComponent } from '@forms/custom-sections/trl-brakes/trl-brakes.component';
import { TyresComponent } from '@forms/custom-sections/tyres/tyres.component';
import { WeightsComponent } from '@forms/custom-sections/weights/weights.component';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { FormNode, CustomFormArray, CustomFormGroup } from '@forms/services/dynamic-form.types';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { AxlesService } from '@services/axles.service';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { editableTechRecord } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { cloneDeep, merge } from 'lodash';
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

  @Input() techRecord!: TechRecordModel;

  @Output() isFormDirty = new EventEmitter<boolean>();
  @Output() isFormInvalid = new EventEmitter<boolean>();

  private _isEditing: boolean = false;
  get isEditing(): boolean {
    return this._isEditing;
  }
  @Input() set isEditing(value: boolean) {
    this._isEditing = value;
  }

  techRecordCalculated!: TechRecordModel;
  sectionTemplates: Array<FormNode> = [];
  middleIndex = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private axlesService: AxlesService,
    private errorService: GlobalErrorService,
    private referenceDataService: ReferenceDataService,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {}

  ngOnInit(): void {
    this.techRecordCalculated = cloneDeep(this.techRecord);

    if (this.techRecordCalculated.vehicleType === VehicleTypes.HGV || this.techRecordCalculated.vehicleType === VehicleTypes.TRL) {
      const [axles, axleSpacing] = this.axlesService.normaliseAxles(
        this.techRecordCalculated.axles,
        this.techRecordCalculated.dimensions?.axleSpacing
      );
      this.techRecordCalculated.dimensions = { ...this.techRecordCalculated.dimensions, axleSpacing };
      this.techRecordCalculated.axles = axles;
    }

    this.technicalRecordService.updateEditingTechRecord(this.techRecordCalculated, true);

    this.store
      .pipe(
        select(editableTechRecord),
        //Need to check that the editing tech record has more than just reason for creation on and is the full object.
        map(techRecord =>
          techRecord && Object.keys(techRecord).length > 1 ? cloneDeep(techRecord) : { ...cloneDeep(this.techRecord), reasonForCreation: '' }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(techRecord => (this.techRecordCalculated = techRecord));

    this.referenceDataService.removeTyreSearch();
    this.sectionTemplates = this.vehicleTemplates;
    this.middleIndex = Math.floor(this.sectionTemplates.length / 2);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    const commonCustomSections = [this.body?.form, this.dimensions?.form, this.tyres?.form, this.weights?.form];

    switch (this.techRecordCalculated.vehicleType) {
      case VehicleTypes.PSV:
        return [...commonCustomSections, this.psvBrakes!.form];
      case VehicleTypes.HGV:
        return commonCustomSections;
      case VehicleTypes.TRL:
        return [...commonCustomSections, this.trlBrakes!.form];
      default:
        return [];
    }
  }

  handleFormState(event: any): void {
    this.techRecordCalculated = merge(cloneDeep(this.techRecordCalculated), event);

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
}
