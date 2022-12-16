import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { HgvAndTrlBodyTemplate } from '@forms/templates/general/hgv-trl-body.template';
import { PsvBodyTemplate } from '@forms/templates/psv/psv-body.template';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { BodyTypeDescription, bodyTypeMap } from '@models/body-type-enum';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { BodyType, TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { Subject, debounceTime, takeUntil, Observable, map, take, skipWhile, combineLatest } from 'rxjs';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit, OnChanges, OnDestroy {
  @Input() vehicleTechRecord!: TechRecordModel;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  public form!: CustomFormGroup;
  public bodyTypeOptions: MultiOptions = getOptionsFromEnum(BodyTypeDescription);
  private template!: FormNode;
  private destroy$ = new Subject<void>();

  constructor(private dfs: DynamicFormService, private optionsService: MultiOptionsService, private referenceDataService: ReferenceDataService) {}

  ngOnInit(): void {
    this.template = this.vehicleTechRecord.vehicleType === VehicleTypes.PSV ? PsvBodyTemplate : HgvAndTrlBodyTemplate;
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
    this.optionsService.loadOptions(ReferenceDataResourceType.PsvMake);
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

  get bodyMakes$(): Observable<MultiOptions | undefined> {
    return this.optionsService.getOptions(ReferenceDataResourceType.BodyMake);
  }

  get dtpNumbers$(): Observable<MultiOptions> {
    return combineLatest([
      this.referenceDataService.getAll$(ReferenceDataResourceType.PsvMake),
      this.referenceDataService.getReferencePsvMakeDataLoading()
    ]).pipe(
      skipWhile(([data, loading]) => loading),
      take(1),
      map(([data, loading]) => {
        return data?.map(option => ({ value: option.resourceKey, label: option.resourceKey })) as MultiOptions;
      })
    );
  }

  get bodyTypeForm(): FormGroup {
    return this.form.get(['bodyType']) as FormGroup;
  }

  get brakesForm(): FormGroup {
    return this.form.get(['brakes']) as FormGroup;
  }
}
