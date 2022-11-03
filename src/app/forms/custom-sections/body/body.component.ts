import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { hgvAndTrlBodyTemplate } from '@forms/templates/hgv/hgv-trl-body.template';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { BodyTypeDescription, bodyTypeMap } from '@models/body-type-enum';
import { BodyModel, ReferenceDataResourceType } from '@models/reference-data.model';
import { BodyType, TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { ReferenceDataState, selectAllReferenceDataByResourceType } from '@store/reference-data';
import { Subject, debounceTime, takeUntil, Observable, map } from 'rxjs';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit, OnChanges, OnDestroy {
  @Input() vehicleTechRecord!: TechRecordModel;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;
  template!: FormNode;

  private destroy$ = new Subject<void>();

  constructor(private dfs: DynamicFormService, private optionsService: MultiOptionsService, private referenceDataStore: Store<ReferenceDataState>) {}

  ngOnInit(): void {
    this.template = this.vehicleTechRecord.vehicleType === VehicleTypes.PSV ? PsvBodyTemplate : hgvAndTrlBodyTemplate;

    this.form = this.dfs.createForm(this.template, this.vehicleTechRecord) as CustomFormGroup;

    this.form.cleanValueChanges.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe((event: any) => {
      // Set the body type code automatically based selection
      const bodyType = event?.bodyType as BodyType;
      if (bodyType?.description) {
        event.bodyType['code'] = bodyTypeMap.get(bodyType.description);
      }

      this.formChange.emit(event);
    });

    this.optionsService.loadOptions(ReferenceDataResourceType.BodyMake);
    this.optionsService.loadOptions(ReferenceDataResourceType.BodyModel);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { vehicleTechRecord } = changes;

    if (this.form && vehicleTechRecord?.currentValue && vehicleTechRecord.currentValue !== vehicleTechRecord.previousValue) {
      this.form.patchValue(vehicleTechRecord.currentValue, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get editTypes(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  get numberOptions(): MultiOptions {
    return Array.from(Array(10).keys()).map(i => ({ value: i, label: `${i}` }));
  }

  get bodyTypes(): MultiOptions {
    return getOptionsFromEnum(BodyTypeDescription);
  }

  get bodyMakes$(): Observable<MultiOptions> {
    return this.optionsService.getOptions(ReferenceDataResourceType.BodyMake);
  }

  get bodyModels$(): Observable<MultiOptions> {
    return this.referenceDataStore
      .select(selectAllReferenceDataByResourceType(ReferenceDataResourceType.BodyModel))
      .pipe(
        map(bodyModels =>
          bodyModels
            .filter(bodyModel => (bodyModel as BodyModel).bodyMake === this.vehicleTechRecord.make)
            .map(bodyModel => ({ value: bodyModel.description, label: bodyModel.description }))
        )
      );
  }

  get bodyTypeForm(): FormGroup {
    return this.form.get(['bodyType']) as FormGroup;
  }
}
