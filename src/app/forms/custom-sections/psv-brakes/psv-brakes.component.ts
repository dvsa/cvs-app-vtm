import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { PsvBrakesTemplate } from '@forms/templates/psv/psv-brakes.template';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { Brake, ReferenceDataResourceType } from '@models/reference-data.model';
import { Retarders } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { ReferenceDataState, selectBrakeByCode } from '@store/reference-data';
import { updateBrakeForces } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Observable, Subject, debounceTime, of, switchMap, takeUntil, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-psv-brakes',
  templateUrl: './psv-brakes.component.html',
  styleUrls: ['./psv-brakes.component.scss']
})
export class PsvBrakesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() vehicleTechRecord!: TechRecordType<'psv'>;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;
  template!: FormNode;

  selectedBrake?: Brake;

  private destroy$ = new Subject<void>();

  constructor(
    private dfs: DynamicFormService,
    private optionsService: MultiOptionsService,
    private referenceDataStore: Store<ReferenceDataState>,
    private store: Store<TechnicalRecordServiceState>
  ) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(PsvBrakesTemplate, this.vehicleTechRecord) as CustomFormGroup;

    (this.form.cleanValueChanges as Observable<Partial<TechRecordType<'psv'>>>)
      .pipe(
        switchMap(event => {
          return event?.techRecord_brakes_brakeCodeOriginal
            ? this.referenceDataStore.select(selectBrakeByCode(event.techRecord_brakes_brakeCodeOriginal))
            : of(undefined);
        }),
        withLatestFrom(this.form.cleanValueChanges as Observable<Partial<TechRecordType<'psv'>>>),
        debounceTime(400),
        takeUntil(this.destroy$)
      )
      .subscribe(([selectedBrake, event]) => {
        // Set the brake details automatically based selection
        if (selectedBrake && event?.techRecord_brakes_brakeCodeOriginal) {
          event.techRecord_brakes_brakeCode = `${this.brakeCodePrefix}${selectedBrake.resourceKey}`;
          event.techRecord_brakes_dataTrBrakeOne = selectedBrake.service;
          event.techRecord_brakes_dataTrBrakeTwo = selectedBrake.secondary;
          event.techRecord_brakes_dataTrBrakeThree = selectedBrake.parking;
        }

        if (event?.techRecord_axles) {
          event.techRecord_axles = event.techRecord_axles.filter(axle => !!axle?.axleNumber);
        }

        this.formChange.emit(event);

        if (event.techRecord_brakes_brakeCodeOriginal) {
          this.store.dispatch(updateBrakeForces({}));
        }
      });

    this.optionsService.loadOptions(ReferenceDataResourceType.Brakes);
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

  get brakeCode(): string {
    return `${this.brakeCodePrefix}${this.form.get('techRecord_brakes_brakeCodeOriginal')?.value}`;
  }

  get brakesForm(): FormGroup {
    return this.form.get('brakes') as FormGroup;
  }

  get booleanOptions(): MultiOptions {
    return [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' }
    ];
  }

  get retarderOptions(): MultiOptions {
    return getOptionsFromEnum(Retarders);
  }

  get brakeCodeOptions$(): Observable<MultiOptions> {
    return this.optionsService.getOptions(ReferenceDataResourceType.Brakes) as Observable<MultiOptions>;
  }

  get editTypes(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  get brakeCodePrefix(): string {
    const prefix = `${Math.round(this.vehicleTechRecord!.techRecord_grossLadenWeight! / 100)}`;

    return prefix.length <= 2 ? '0' + prefix : prefix;
  }

  get axles(): FormArray {
    return this.form.get(['techRecord_axles']) as FormArray;
  }

  getAxleForm(i: number): FormGroup {
    return this.form.get(['techRecord_axles', i]) as FormGroup;
  }

  round(n: number): number {
    return Math.round(n);
  }
}
