import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { HgvAndTrlBodyTemplate } from '@forms/templates/general/hgv-trl-body.template';
import { PsvBodyTemplate } from '@forms/templates/psv/psv-body.template';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { bodyTypeMap, vehicleBodyTypeCodeMap } from '@models/body-type-enum';
import { PsvMake, ReferenceDataResourceType } from '@models/reference-data.model';
import { BodyType, TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { State } from '@store/index';
import { selectReferenceDataByResourceKey } from '@store/reference-data';
import { updateBody } from '@store/technical-records';
import { Subject, debounceTime, takeUntil, Observable, map, take, skipWhile, combineLatest, mergeMap } from 'rxjs';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit, OnChanges, OnDestroy {
  @Input() techRecord!: TechRecordModel;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  public form!: CustomFormGroup;
  private template!: FormNode;
  private destroy$ = new Subject<void>();

  constructor(
    private dfs: DynamicFormService,
    private optionsService: MultiOptionsService,
    private referenceDataService: ReferenceDataService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.template = this.techRecord.vehicleType === VehicleTypes.PSV ? PsvBodyTemplate : HgvAndTrlBodyTemplate;
    this.form = this.dfs.createForm(this.template, this.techRecord) as CustomFormGroup;
    this.form.cleanValueChanges
      .pipe(
        debounceTime(400),
        takeUntil(this.destroy$),
        mergeMap((event: any) =>
          this.store.pipe(
            select(selectReferenceDataByResourceKey(ReferenceDataResourceType.PsvMake, event.brakes.dtpNumber)),
            take(1),
            map(referenceData => [event, referenceData as PsvMake])
          )
        )
      )
      .subscribe(([event, psvMake]) => {
        // Set the body type code automatically based selection
        const bodyType = event?.bodyType as BodyType;

        if (bodyType?.description) {
          event.bodyType['code'] = bodyTypeMap.get(bodyType.description);
        }

        this.formChange.emit(event);

        if (this.techRecord.vehicleType === VehicleTypes.PSV && event?.brakes?.dtpNumber && event.brakes.dtpNumber.length >= 4) {
          this.store.dispatch(updateBody({ psvMake }));
        }
      });

    this.optionsService.loadOptions(
      this.techRecord.vehicleType === VehicleTypes.HGV ? ReferenceDataResourceType.HgvMake : ReferenceDataResourceType.TrlMake
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { techRecord } = changes;

    if (this.form && techRecord?.currentValue && techRecord.currentValue !== techRecord.previousValue) {
      this.form.patchValue(techRecord.currentValue, { emitEvent: false });
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

  get bodyTypes(): MultiOptions {
    const map = vehicleBodyTypeCodeMap.get(this.techRecord.vehicleType);
    const values = [...map!.values()];
    return getOptionsFromEnum(values.sort());
  }

  get bodyMakes$(): Observable<MultiOptions | undefined> {
    return this.optionsService.getOptions(
      this.techRecord.vehicleType === VehicleTypes.HGV ? ReferenceDataResourceType.HgvMake : ReferenceDataResourceType.TrlMake
    );
  }

  get dtpNumbers$(): Observable<MultiOptions> {
    return combineLatest([
      this.referenceDataService.getAll$(ReferenceDataResourceType.PsvMake),
      this.referenceDataService.getReferencePsvMakeDataLoading$()
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
