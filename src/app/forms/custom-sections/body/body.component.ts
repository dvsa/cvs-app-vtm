import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
} from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TechRecordType as TechRecordVehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import {
  CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeWidth,
} from '@forms/services/dynamic-form.types';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { HgvAndTrlBodyTemplate } from '@forms/templates/general/hgv-trl-body.template';
import { PsvBodyTemplate } from '@forms/templates/psv/psv-body.template';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { vehicleBodyTypeCodeMap, vehicleBodyTypeDescriptionMap } from '@models/body-type-enum';
import { PsvMake, ReferenceDataResourceType } from '@models/reference-data.model';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store, select } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { State } from '@store/index';
import { selectReferenceDataByResourceKey } from '@store/reference-data';
import { updateBody, updateEditingTechRecord } from '@store/technical-records';
import {
  Observable, Subject, combineLatest, debounceTime, map, mergeMap, skipWhile, take, takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
})
export class BodyComponent implements OnInit, OnChanges, OnDestroy {
  @Input() techRecord!: V3TechRecordModel;
  @Input() isEditing = false;
  @Input() disableLoadOptions = false;

  @Output() formChange = new EventEmitter();

  public form!: CustomFormGroup;
  private template!: FormNode;
  private destroy$ = new Subject<void>();

  constructor(
    private dfs: DynamicFormService,
    private optionsService: MultiOptionsService,
    private referenceDataService: ReferenceDataService,
    private store: Store<State>,
  ) { }

  ngOnInit(): void {
    this.template = this.techRecord.techRecord_vehicleType === VehicleTypes.PSV ? PsvBodyTemplate : HgvAndTrlBodyTemplate;
    this.form = this.dfs.createForm(this.template, this.techRecord) as CustomFormGroup;
    this.form.cleanValueChanges
      .pipe(
        debounceTime(400),
        takeUntil(this.destroy$),
        mergeMap((event: any) =>
          this.store.pipe(
            select(selectReferenceDataByResourceKey(ReferenceDataResourceType.PsvMake, event.techRecord_brakes_dtpNumber)),
            take(1),
            map((referenceData) => [event, referenceData as PsvMake]),
          )),
      )
      .subscribe(([event, psvMake]) => {
        // Set the body type code automatically based selection
        if (event?.techRecord_bodyType_description) {
          // body type codes are specific to the vehicle type
          const bodyTypes = vehicleBodyTypeDescriptionMap.get(this.techRecord.techRecord_vehicleType as VehicleTypes);
          event.techRecord_bodyType_code = bodyTypes!.get(event?.techRecord_bodyType_description);
        }

        this.formChange.emit(event);

        if (
          this.techRecord.techRecord_vehicleType === VehicleTypes.PSV
          && event?.techRecord_brakes_dtpNumber
          && event.techRecord_brakes_dtpNumber.length >= 4
          && psvMake
        ) {
          this.store.dispatch(updateBody({ psvMake }));
        }
      });

    this.loadOptions();
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
    let vehicleType: string = this.techRecord.techRecord_vehicleType;

    if (this.techRecord.techRecord_vehicleType === 'hgv') {
      vehicleType = `${this.techRecord.techRecord_vehicleConfiguration}Hgv`;
      this.updateHgvVehicleBodyType(this.techRecord);
    }
    const optionsMap = vehicleBodyTypeCodeMap.get(vehicleType) ?? [];
    const values = [...optionsMap.values()];
    return getOptionsFromEnum(values.sort());

  }

  get bodyMakes$(): Observable<MultiOptions | undefined> {
    if (this.techRecord.techRecord_vehicleType === VehicleTypes.HGV) {
      return this.optionsService.getOptions(ReferenceDataResourceType.HgvMake);
    }
    if (this.techRecord.techRecord_vehicleType === VehicleTypes.PSV) {
      return this.optionsService.getOptions(ReferenceDataResourceType.PsvMake);
    }
    return this.optionsService.getOptions(ReferenceDataResourceType.TrlMake);
  }

  get dtpNumbers$(): Observable<MultiOptions> {
    return combineLatest([
      this.referenceDataService.getAll$(ReferenceDataResourceType.PsvMake),
      this.referenceDataService.getReferencePsvMakeDataLoading$(),
    ]).pipe(
      skipWhile(([_, loading]) => loading),
      take(1),
      map(([data]) => {
        return data?.map((option) => ({ value: option.resourceKey, label: option.resourceKey })) as MultiOptions;
      }),
    );
  }

  loadOptions(): void {
    if (this.disableLoadOptions) return;

    if (this.techRecord.techRecord_vehicleType === VehicleTypes.HGV) {
      this.optionsService.loadOptions(ReferenceDataResourceType.HgvMake);
    } else if (this.techRecord.techRecord_vehicleType === VehicleTypes.PSV) {
      this.optionsService.loadOptions(ReferenceDataResourceType.PsvMake);
    } else {
      this.optionsService.loadOptions(ReferenceDataResourceType.TrlMake);
    }
  }

  updateHgvVehicleBodyType(record: TechRecordVehicleType<'hgv'>) {
    if (record.techRecord_vehicleConfiguration === 'articulated') {
      this.store.dispatch(updateEditingTechRecord({
        vehicleTechRecord: { ...this.techRecord, techRecord_bodyType_description: 'articulated' } as TechRecordType<'put'>,
      }));
    }
  }
}
