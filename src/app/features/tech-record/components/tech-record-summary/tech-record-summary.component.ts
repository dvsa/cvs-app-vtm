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

  private destroy$ = new Subject<void>();

  constructor(
    private axlesService: AxlesService,
    private errorService: GlobalErrorService,
    private referenceDataService: ReferenceDataService,
    private technicalRecordService: TechnicalRecordService
  ) {}

  ngOnInit(): void {
    let isOnInit = true;
    this.technicalRecordService.editableTechRecord$
      .pipe(
        //Need to check that the editing tech record has more than just reason for creation on and is the full object.
        map(techRecord => {
          if (techRecord && Object.keys(techRecord).length > 1) {
            return cloneDeep(techRecord);
          } else {
            if (this.techRecord.vehicleType === VehicleTypes.HGV || this.techRecord.vehicleType === VehicleTypes.TRL) {
              const [axles, axleSpacing] = this.axlesService.normaliseAxles(this.techRecord.axles, this.techRecord.dimensions?.axleSpacing);
              this.techRecord = cloneDeep(this.techRecord);
              this.techRecord.dimensions = { ...this.techRecord.dimensions, axleSpacing };
              this.techRecord.axles = axles;
            }

            isOnInit && this.technicalRecordService.updateEditingTechRecord(this.techRecord, true);

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
    isOnInit = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get vehicleType() {
    return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecordCalculated);
  }

  get vehicleTemplates(): Array<FormNode> {
    return (
      vehicleTemplateMap.get(this.vehicleType)?.filter(template => template.name !== (this.isEditing ? 'audit' : 'reasonForCreationSection')) ?? []
    );
  }

  get customSectionForms(): Array<CustomFormGroup | CustomFormArray> {
    const commonCustomSections = [this.body?.form, this.dimensions?.form, this.tyres?.form, this.weights?.form];

    switch (this.vehicleType) {
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
