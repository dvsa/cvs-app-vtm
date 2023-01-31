import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { TrlBrakesTemplate } from '@forms/templates/trl/trl-brakes.template';
import { TechRecordModel } from '@models/vehicle-tech-record.model';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-trl-brakes[vehicleTechRecord]',
  templateUrl: './trl-brakes.component.html',
  styleUrls: ['./trl-brakes.component.scss']
})
export class TrlBrakesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() vehicleTechRecord!: TechRecordModel;
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

    this.form.cleanValueChanges.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe(event => this.formChange.emit(event));
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

  axleControl(control: AbstractControl) {
    return control as FormGroup;
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get brakes(): FormGroup {
    return this.form.get(['brakes']) as FormGroup;
  }

  get axles(): FormArray {
    return this.form.get(['axles']) as FormArray;
  }

  getAxleBrakes(i: number): FormGroup {
    return this.form.get(['axles', i, 'brakes']) as FormGroup;
  }

  pascalCase = (s: string): string =>
    s.charAt(0).toUpperCase() +
    s
      .slice(1)
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase();
}
