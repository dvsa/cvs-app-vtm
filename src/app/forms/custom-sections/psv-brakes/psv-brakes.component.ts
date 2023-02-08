import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { PsvBrakesTemplate } from '@forms/templates/psv/psv-brakes.template';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { Brake, ReferenceDataResourceType } from '@models/reference-data.model';
import { Axle, Retarders, TechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { ReferenceDataState, selectBrakeByCode } from '@store/reference-data';
import { updateBrakeForces } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { debounceTime, mergeMap, Observable, of, Subject, takeUntil, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-psv-brakes',
  templateUrl: './psv-brakes.component.html',
  styleUrls: ['./psv-brakes.component.scss']
})
export class PsvBrakesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() vehicleTechRecord!: TechRecordModel;
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

    this.form.cleanValueChanges
      .pipe(
        debounceTime(400),
        takeUntil(this.destroy$),
        mergeMap((event: any) =>
          event?.brakes?.brakeCodeOriginal ? this.referenceDataStore.select(selectBrakeByCode(event.brakes.brakeCodeOriginal)) : of(undefined)
        ),
        withLatestFrom(this.form.cleanValueChanges)
      )
      .subscribe(([selectedBrake, event]: [Brake | undefined, any]) => {
        // Set the brake details automatically based selection
        if (selectedBrake && event?.brakes?.brakeCodeOriginal) {
          event.brakes['dataTrBrakeOne'] = selectedBrake.service;
          event.brakes['dataTrBrakeTwo'] = selectedBrake.secondary;
          event.brakes['dataTrBrakeThree'] = selectedBrake.parking;
        }

        if (event?.axles) {
          event.axles = (event.axles as Axle[]).filter(axle => !!axle?.axleNumber);
        }

        this.formChange.emit(event);

        if (event.brakes?.brakeCodeOriginal) {
          this.store.dispatch(updateBrakeForces({}));
        }
      });

    this.optionsService.loadOptions(ReferenceDataResourceType.Brake);
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
    return this.optionsService.getOptions(ReferenceDataResourceType.Brake) as Observable<MultiOptions>;
  }

  get editTypes(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  get brakeCodePrefix(): string {
    const prefix = `${Math.round(this.vehicleTechRecord!.grossLadenWeight! / 100)}`;

    return prefix.length <= 2 ? '0' + prefix : prefix;
  }

  get axles(): FormArray {
    return this.form.get(['axles']) as FormArray;
  }

  getAxleForm(i: number): FormGroup {
    return this.form.get(['axles', i]) as FormGroup;
  }

  round(n: number): number {
    return Math.round(n);
  }
}
