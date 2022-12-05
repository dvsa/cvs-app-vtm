import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { HgvAndTrlBodyTemplate } from '@forms/templates/general/hgv-trl-body.template';
import { PsvBodyTemplate } from '@forms/templates/psv/psv-body.template';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { BodyTypeCode, BodyTypeDescription, bodyTypeMap } from '@models/body-type-enum';
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
export class BodyComponent implements OnInit, OnDestroy {
  @Input() vehicleTechRecord!: TechRecordModel;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;
  template!: FormNode;
  bodyTypeOptions: MultiOptions = getOptionsFromEnum(BodyTypeDescription);

  private destroy$ = new Subject<void>();

  constructor(private dfs: DynamicFormService, private optionsService: MultiOptionsService, private referenceDataStore: Store<ReferenceDataState>) {}

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

  get bodyTypeForm(): FormGroup {
    return this.form.get(['bodyType']) as FormGroup;
  }
}
