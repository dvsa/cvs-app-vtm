import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { TrlBrakesTemplate } from '@forms/templates/trl/trl-brakes.template';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-trl-brakes[vehicleTechRecord]',
  templateUrl: './trl-brakes.component.html',
  styleUrls: ['./trl-brakes.component.scss']
})
export class TrlBrakesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() vehicleTechRecord!: TechRecordType<'trl'>;
  @Input() isEditing = false;
  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;

  booleanOptions: MultiOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];

  private destroy$ = new Subject<void>();

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(TrlBrakesTemplate, this.vehicleTechRecord) as CustomFormGroup;

    this.form.cleanValueChanges.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe((event: any) => {
      if (event?.techRecord_axles) {
        event.techRecord_axles = (event.techRecord_axles as any).filter((axle: any) => !!axle?.axleNumber);
      }

      this.formChange.emit(event);
    });
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

  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get axles(): FormArray {
    return this.form.get(['techRecord_axles']) as FormArray;
  }

  getAxleForm(i: number): FormGroup {
    return this.form.get(['techRecord_axles', i]) as FormGroup;
  }

  getAxleBrakes(i: number): FormGroup {
    return this.form.get(['techRecord_axles', i, 'brakes']) as FormGroup;
  }

  stripName = (s: string): string => {
    const splitString = s.split('_').pop() ?? '';
    return (
      splitString.charAt(0).toUpperCase() +
      splitString
        .slice(1)
        .replace(/([A-Z])/g, ' $1')
        .toLowerCase()
    );
  };
}
